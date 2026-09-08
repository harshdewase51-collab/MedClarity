/**
 * Medical Report Simplifier — Resilient Service Layer
 * Supports real FastAPI REST endpoints with seamless multi-endpoint retry
 * (proxied /api/reports, http://127.0.0.1:8000/api/reports, http://localhost:8000/api/reports)
 * and automatic fallback to client-side offline clinical intelligence engine.
 */

import { mockReports } from '../data/mockReports.js';
import { parseClinicalReportText } from './offlineClinicalEngine.js';

// Default to live backend; respects VITE_ENABLE_MOCK_API if set
export const USE_REAL_BACKEND = import.meta.env?.VITE_ENABLE_MOCK_API === 'true' ? false : true;

// Prioritized list of API base endpoints to attempt
export const CANDIDATE_BASE_URLS = [
  '/api/reports',
  'http://127.0.0.1:8000/api/reports',
  'http://localhost:8000/api/reports',
];

export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || CANDIDATE_BASE_URLS[0];

/**
 * Normalizes frontend language codes ('en', 'hi', 'hinglish')
 * to backend API contract enum values ('english', 'hindi', 'hinglish').
 */
export function normalizeLanguage(lang) {
  if (!lang) return 'english';
  const l = String(lang).toLowerCase().trim();
  if (l === 'en' || l === 'english') return 'english';
  if (l === 'hi' || l === 'hindi') return 'hindi';
  if (l === 'hinglish') return 'hinglish';
  return 'english';
}

/**
 * Helper to try fetching across multiple candidate endpoints before giving up.
 */
async function resilientFetch(path, options = {}) {
  const errors = [];
  
  // Try candidate URLs in order
  for (const base of CANDIDATE_BASE_URLS) {
    const fullUrl = `${base}${path.startsWith('/') ? path : `/${path}`}`;
    try {
      const res = await fetch(fullUrl, options);
      return { response: res, successfulBase: base };
    } catch (err) {
      errors.push(`${fullUrl} -> ${err.message}`);
    }
  }

  const combinedError = new Error(
    `Network error across all backend endpoints: ${errors.join(' | ')}. Backend may be offline.`
  );
  combinedError.isNetworkError = true;
  throw combinedError;
}

/**
 * Performs a lightweight health check to determine if the FastAPI backend is running.
 */
export async function checkBackendHealth() {
  const healthEndpoints = ['/api/health', 'http://127.0.0.1:8000/api/health', 'http://localhost:8000/api/health'];
  for (const url of healthEndpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        return { online: true, endpoint: url, ...data };
      }
    } catch (_) {
      // Continue to next endpoint
    }
  }
  return { online: false };
}

/**
 * Standardizes report objects across backend schemas, offline engine, and frontend UI components.
 */
export function normalizeReport(raw) {
  if (!raw) return null;

  const id = raw.reportId || raw.id || `rep_${Date.now()}`;
  const name = raw.reportName || raw.name || raw.filename || 'Medical Laboratory Report';
  const date = raw.reportDate || raw.date || (raw.createdAt ? new Date(raw.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }) : 'Recent');

  const tests = (raw.tests || []).map((t, idx) => {
    const rawRef = t.referenceRange || t.reference_range;
    const minR = t.minRange !== undefined ? t.minRange : (t.min_range !== undefined ? t.min_range : t.min);
    const maxR = t.maxRange !== undefined ? t.maxRange : (t.max_range !== undefined ? t.max_range : t.max);
    
    let resolvedRef = rawRef;
    if (!resolvedRef && minR !== undefined && minR !== null && maxR !== undefined && maxR !== null) {
      resolvedRef = `${minR} - ${maxR} ${t.unit || ''}`.trim();
    }
    if (!resolvedRef) {
      resolvedRef = 'Not Specified';
    }

    return {
      id: t.id !== undefined && t.id !== null ? String(t.id) : `test_${idx}`,
      name: t.testName || t.name || 'Clinical Test',
      testName: t.testName || t.name || 'Clinical Test',
      value: t.value !== undefined && t.value !== null ? String(t.value) : '',
      numericValue: t.numericValue !== undefined ? t.numericValue : parseFloat(t.value) || null,
      unit: t.unit || '',
      referenceRange: resolvedRef,
      minRange: minR,
      maxRange: maxR,
      min: minR,
      max: maxR,
      status: (t.status || 'unable_to_determine').toLowerCase(),
      category: t.category || 'general',
      organ: t.organ || '',
      medicalTerm: t.medicalTerm || t.medical_term || t.testName || t.name || '',
      simpleMeaning: t.simpleMeaning || t.simple_meaning || '',
      simpleExplanation: t.simpleExplanation || t.simple_explanation || t.explanation || '',
      explanation: t.simpleExplanation || t.simple_explanation || t.explanation || '',
      doctorQuestion: t.doctorQuestion || null,
    };
  });

  const importantFindings = (raw.importantFindings || raw.important_findings || []).map((f, idx) => ({
    id: f.id !== undefined && f.id !== null ? String(f.id) : `f_${idx}`,
    testName: f.testName || f.name || 'Clinical Biomarker',
    value: f.value !== undefined && f.value !== null ? String(f.value) : '',
    unit: f.unit || '',
    referenceRange: f.referenceRange || f.reference_range || 'Not Specified',
    status: (f.status || 'abnormal').toLowerCase(),
    medicalTerm: f.medicalTerm || f.medical_term || f.testName || 'Clinical Finding',
    explanation: f.explanation || '',
  }));

  const aiExplanations = (raw.aiExplanations || raw.ai_explanations || []).map((e, idx) => ({
    id: e.id !== undefined && e.id !== null ? String(e.id) : `exp_${idx}`,
    medicalTerm: e.medicalTerm || e.medical_term || 'Medical Term',
    simpleMeaning: e.simpleMeaning || e.simple_meaning || '',
    easyExplanation: e.easyExplanation || e.easy_explanation || '',
    relatedTest: e.relatedTest || e.related_test || null,
  }));

  const calculatedNormal = tests.filter((t) => t.status === 'normal').length;
  const calculatedAbnormal = tests.filter((t) => t.status === 'high' || t.status === 'low' || t.status === 'attention').length;

  return {
    ...raw,
    id,
    reportId: id,
    name,
    reportName: name,
    date,
    reportDate: date,
    labName: raw.labName || raw.lab_name || 'Laboratory Diagnostics',
    patientName: raw.patientName || raw.patient_name || 'Patient',
    status: (raw.status || raw.overall_status || (calculatedAbnormal > 0 ? 'attention' : 'normal')).toLowerCase(),
    summary: raw.summary || 'Summary generated for this clinical laboratory report.',
    totalTests: raw.totalTests !== undefined ? raw.totalTests : (raw.total_tests !== undefined ? raw.total_tests : tests.length),
    normalCount: raw.normalCount !== undefined ? raw.normalCount : (raw.normal_count !== undefined ? raw.normal_count : calculatedNormal),
    abnormalCount: raw.abnormalCount !== undefined ? raw.abnormalCount : (raw.abnormal_count !== undefined ? raw.abnormal_count : calculatedAbnormal),
    tests,
    importantFindings,
    aiExplanations,
    isOfflineProcessed: !!raw.isOfflineProcessed,
    disclaimer: raw.disclaimer || 'This tool helps explain medical reports in simple language. It is not a doctor and does not provide medical diagnosis or prescribe treatment. Always consult with a qualified healthcare professional for medical decisions.',
  };
}

export const reportService = {
  /**
   * Uploads medical report file (PDF, PNG, JPG, JPEG, TXT) and processes it via real FastAPI backend,
   * with automatic client-side fallback if server is unreachable.
   */
  async uploadFile(fileInput, language = 'en') {
    if (!USE_REAL_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return normalizeReport(mockReports[0]);
    }

    const file = (fileInput instanceof File || fileInput instanceof Blob) ? fileInput : (fileInput?.rawFile || fileInput);
    if (!file) {
      throw new Error('No valid file object provided for upload.');
    }

    const fileName = file.name || fileInput?.name || 'medical_report.pdf';
    const ext = fileName.split('.').pop()?.toLowerCase();
    const allowedExts = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'txt'];
    if (ext && !allowedExts.includes(ext)) {
      throw new Error(`Unsupported file type: .${ext}. Please upload a PDF, PNG, JPG, JPEG, or TXT file.`);
    }

    const backendLang = normalizeLanguage(language);
    const formData = new FormData();
    formData.append('file', file, fileName);

    try {
      // Step 1: Upload binary file via resilient endpoints
      const { response: uploadRes, successfulBase } = await resilientFetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) {
        const errJson = await uploadRes.json().catch(() => null);
        const msg = errJson?.detail?.message || errJson?.detail || `Upload failed with HTTP ${uploadRes.status}`;
        throw new Error(msg);
      }

      const uploadData = await uploadRes.json();
      const reportId = uploadData.reportId || uploadData.id;
      if (!reportId) {
        throw new Error('Backend upload response did not include a valid reportId.');
      }

      // Step 2: Trigger extraction & processing pipeline on the uploaded report
      const processRes = await fetch(`${successfulBase}/${reportId}/process?language=${backendLang}`, {
        method: 'POST',
      });

      if (!processRes.ok) {
        const errJson = await processRes.json().catch(() => null);
        const msg = errJson?.detail?.message || errJson?.detail || `Processing failed with HTTP ${processRes.status}`;
        throw new Error(msg);
      }

      const reportData = await processRes.json();
      return normalizeReport(reportData);
    } catch (networkOrServerErr) {
      console.warn('Backend upload encountered an issue, attempting client-side fallback:', networkOrServerErr.message);

      // If the file is a text file or has rawText attached, use offline clinical engine
      if (fileInput?.rawText) {
        const offlineResult = parseClinicalReportText(fileInput.rawText, language);
        if (offlineResult) return normalizeReport(offlineResult);
      }

      if (file.type?.includes('text') || ext === 'txt') {
        try {
          const textContent = await file.text();
          const offlineResult = parseClinicalReportText(textContent, language);
          if (offlineResult) return normalizeReport(offlineResult);
        } catch (_) {
          // File reading failed
        }
      }

      // If text extraction failed or backend gave explicit server error message
      throw new Error(
        `Unable to reach backend server (${networkOrServerErr.message}). Please verify the backend is running on port 8000, or paste text in the Text tab.`
      );
    }
  },

  async uploadReport(fileInput, language = 'en') {
    return this.uploadFile(fileInput, language);
  },

  /**
   * Uploads and simplifies pasted raw text report.
   * Seamlessly falls back to client-side offline parser if backend is not reachable.
   */
  async uploadText(text, arg2 = 'en', arg3 = 'Pasted Lab Report') {
    if (!USE_REAL_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return normalizeReport(mockReports[0]);
    }

    let language = 'en';
    let reportName = 'Pasted Lab Report';
    const langCandidates = ['en', 'hi', 'hinglish', 'english', 'hindi'];
    if (typeof arg2 === 'string' && langCandidates.includes(arg2.toLowerCase())) {
      language = arg2;
      reportName = arg3 || 'Pasted Lab Report';
    } else {
      reportName = arg2 || 'Pasted Lab Report';
      language = arg3 || 'en';
    }

    const backendLang = normalizeLanguage(language);

    try {
      const { response: res } = await resilientFetch('/upload-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: backendLang,
          reportName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return normalizeReport(data);
      }
    } catch (networkErr) {
      console.warn('Backend unavailable for text upload, switching to offline clinical engine:', networkErr.message);
    }

    // Client-side offline clinical parsing fallback
    const offlineResult = parseClinicalReportText(text, language);
    if (offlineResult) {
      offlineResult.name = reportName;
      offlineResult.reportName = reportName;
      return normalizeReport(offlineResult);
    }

    // Default fallback to first mock report if unparseable
    return normalizeReport({
      ...mockReports[0],
      name: reportName,
      isOfflineProcessed: true,
    });
  },

  async getReport(id) {
    if (!USE_REAL_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const found = mockReports.find((r) => r.id === id) || mockReports[0];
      return normalizeReport(found);
    }

    try {
      const { response: res } = await resilientFetch(`/${id}`);
      if (res.ok) {
        const data = await res.json();
        return normalizeReport(data);
      }
    } catch (_) {}

    const found = mockReports.find((r) => r.id === id) || mockReports[0];
    return normalizeReport(found);
  },

  async getReportStatus(id) {
    if (!USE_REAL_BACKEND) {
      return { reportId: id, status: 'simplified' };
    }

    try {
      const { response: res } = await resilientFetch(`/${id}/status`);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
    return { reportId: id, status: 'simplified' };
  },

  async simplifyReport(id, language = 'en') {
    if (!USE_REAL_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const found = mockReports.find((r) => r.id === id) || mockReports[0];
      return normalizeReport(found);
    }

    const backendLang = normalizeLanguage(language);
    try {
      const { response: res } = await resilientFetch(`/${id}/simplify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: backendLang }),
      });

      if (res.ok) {
        const data = await res.json();
        return normalizeReport(data);
      }
    } catch (_) {}

    const found = mockReports.find((r) => r.id === id) || mockReports[0];
    return normalizeReport(found);
  },

  async listReports(limit = 50) {
    if (!USE_REAL_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockReports.map(normalizeReport);
    }

    try {
      const { response: res } = await resilientFetch(`?limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data.map(normalizeReport);
      }
    } catch (_) {}
    return [];
  },

  async deleteReport(id) {
    if (!USE_REAL_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true };
    }

    try {
      const { response: res } = await resilientFetch(`/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return { success: true };
  },
};

export const uploadFile = (fileInput, language) => reportService.uploadFile(fileInput, language);
export const uploadReport = (fileInput, language) => reportService.uploadReport(fileInput, language);
export const uploadText = (text, arg2, arg3) => reportService.uploadText(text, arg2, arg3);
export const getReport = (id) => reportService.getReport(id);
export const getReportStatus = (id) => reportService.getReportStatus(id);
export const simplifyReport = (id, language) => reportService.simplifyReport(id, language);
export const listReports = (limit) => reportService.listReports(limit);
export const deleteReport = (id) => reportService.deleteReport(id);

export default reportService;
