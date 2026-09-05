/**
 * Medical Report Simplifier — Service Layer
 * Fully integrated with real FastAPI REST endpoints (backend/API_CONTRACT.md).
 * Exports uploadFile, uploadReport, uploadText, getReport, getReportStatus, simplifyReport, listReports, deleteReport.
 */

import { mockReports } from '../data/mockReports.js';

// Default to live backend; respects VITE_ENABLE_MOCK_API if set
export const USE_REAL_BACKEND = import.meta.env?.VITE_ENABLE_MOCK_API === 'true' ? false : true;
export const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api/reports';

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
 * Standardizes report objects across backend schemas and frontend UI components.
 * Ensures properties like id, name, date, testName, min, max, referenceRange, etc. are always present.
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
      unit: t.unit || '',
      referenceRange: resolvedRef,
      minRange: minR,
      maxRange: maxR,
      min: minR,
      max: maxR,
      status: (t.status || 'unable_to_determine').toLowerCase(),
      medicalTerm: t.medicalTerm || t.medical_term || t.testName || t.name || '',
      simpleMeaning: t.simpleMeaning || t.simple_meaning || '',
      simpleExplanation: t.simpleExplanation || t.simple_explanation || t.explanation || '',
      explanation: t.simpleExplanation || t.simple_explanation || t.explanation || '',
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
    summary: raw.summary || 'Summary is being generated for this report.',
    totalTests: raw.totalTests !== undefined ? raw.totalTests : (raw.total_tests !== undefined ? raw.total_tests : tests.length),
    normalCount: raw.normalCount !== undefined ? raw.normalCount : (raw.normal_count !== undefined ? raw.normal_count : calculatedNormal),
    abnormalCount: raw.abnormalCount !== undefined ? raw.abnormalCount : (raw.abnormal_count !== undefined ? raw.abnormal_count : calculatedAbnormal),
    tests,
    importantFindings,
    aiExplanations,
    disclaimer: raw.disclaimer || 'This tool helps explain medical reports in simple language. It is not a doctor and does not provide medical diagnosis or prescribe treatment. Always consult with a qualified healthcare professional for medical decisions.',
  };
}

export const reportService = {
  /**
   * Uploads medical report file (PDF, PNG, JPG, JPEG, TXT) and processes it via real FastAPI backend.
   * Matches the exact frontend caller: reportService.uploadFile(file, language)
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

    // Determine filename and validate extension
    const fileName = file.name || fileInput?.name || 'medical_report.pdf';
    const ext = fileName.split('.').pop()?.toLowerCase();
    const allowedExts = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'txt'];
    if (ext && !allowedExts.includes(ext)) {
      throw new Error(`Unsupported file type: .${ext}. Please upload a PDF, PNG, JPG, JPEG, or TXT file.`);
    }

    const backendLang = normalizeLanguage(language);
    const formData = new FormData();
    // Providing fileName ensures server receives correct filename even when file is a Blob
    formData.append('file', file, fileName);

    // Step 1: Upload binary file to /api/reports/upload
    let uploadRes;
    try {
      uploadRes = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
    } catch (networkErr) {
      throw new Error(`Network error during file upload: ${networkErr.message}. Please verify the backend is running.`);
    }

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
    let processRes;
    try {
      processRes = await fetch(`${API_BASE_URL}/${reportId}/process?language=${backendLang}`, {
        method: 'POST',
      });
    } catch (networkErr) {
      throw new Error(`Network error during report processing: ${networkErr.message}`);
    }

    if (!processRes.ok) {
      const errJson = await processRes.json().catch(() => null);
      const msg = errJson?.detail?.message || errJson?.detail || `Processing failed with HTTP ${processRes.status}`;
      throw new Error(msg);
    }

    const reportData = await processRes.json();
    return normalizeReport(reportData);
  },

  /**
   * Alias for uploadFile to ensure backward and forward compatibility
   */
  async uploadReport(fileInput, language = 'en') {
    return this.uploadFile(fileInput, language);
  },

  /**
   * Uploads and simplifies pasted raw text report.
   * Handles both signatures: (text, language, reportName) and (text, reportName, language).
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
    let res;
    try {
      res = await fetch(`${API_BASE_URL}/upload-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language: backendLang,
          reportName,
        }),
      });
    } catch (networkErr) {
      throw new Error(`Network error during text upload: ${networkErr.message}`);
    }

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      const msg = errJson?.detail?.message || errJson?.detail || `Text processing failed with HTTP ${res.status}`;
      throw new Error(msg);
    }

    const data = await res.json();
    return normalizeReport(data);
  },

  /**
   * Fetches report by ID
   */
  async getReport(id) {
    if (!USE_REAL_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const found = mockReports.find((r) => r.id === id) || mockReports[0];
      return normalizeReport(found);
    }

    const res = await fetch(`${API_BASE_URL}/${id}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch report' }));
      throw new Error(err.detail || `Failed to fetch report ${id}`);
    }

    const data = await res.json();
    return normalizeReport(data);
  },

  /**
   * Checks lightweight pipeline status
   */
  async getReportStatus(id) {
    if (!USE_REAL_BACKEND) {
      return { reportId: id, status: 'simplified' };
    }

    const res = await fetch(`${API_BASE_URL}/${id}/status`);
    if (!res.ok) {
      return { reportId: id, status: 'unknown' };
    }
    return await res.json();
  },

  /**
   * Dynamically simplifies report in a new language
   */
  async simplifyReport(id, language = 'en') {
    if (!USE_REAL_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const found = mockReports.find((r) => r.id === id) || mockReports[0];
      return normalizeReport(found);
    }

    const backendLang = normalizeLanguage(language);
    const res = await fetch(`${API_BASE_URL}/${id}/simplify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: backendLang }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to translate report' }));
      throw new Error(err.detail || 'Failed to translate report');
    }

    const data = await res.json();
    return normalizeReport(data);
  },

  /**
   * Retrieves all reports for history view
   */
  async listReports(limit = 50) {
    if (!USE_REAL_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockReports.map(normalizeReport);
    }

    const res = await fetch(`${API_BASE_URL}?limit=${limit}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch report history' }));
      throw new Error(err.detail || 'Failed to fetch history');
    }

    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map(normalizeReport);
  },

  /**
   * Deletes a report
   */
  async deleteReport(id) {
    if (!USE_REAL_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return { success: true };
    }

    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to delete report' }));
      throw new Error(err.detail || 'Failed to delete report');
    }

    return await res.json();
  },
};

// Named exports for convenient direct imports
export const uploadFile = (fileInput, language) => reportService.uploadFile(fileInput, language);
export const uploadReport = (fileInput, language) => reportService.uploadReport(fileInput, language);
export const uploadText = (text, arg2, arg3) => reportService.uploadText(text, arg2, arg3);
export const getReport = (id) => reportService.getReport(id);
export const getReportStatus = (id) => reportService.getReportStatus(id);
export const simplifyReport = (id, language) => reportService.simplifyReport(id, language);
export const listReports = (limit) => reportService.listReports(limit);
export const deleteReport = (id) => reportService.deleteReport(id);

export default reportService;
