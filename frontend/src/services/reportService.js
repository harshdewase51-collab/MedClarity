/**
 * Medical Report Simplifier — Service Layer
 * Prepared strictly in accordance with backend/API_CONTRACT.md.
 * 
 * In Phase 12, this service returns realistic mock promises.
 * In Phase 13, this will be connected to real backend endpoints.
 */

import { mockReports } from '../data/mockReports';

// Flag to switch between Mock and Live API in Phase 13
export const USE_REAL_BACKEND = false;
export const API_BASE_URL = 'http://localhost:8000/api/reports';

export const reportService = {
  /**
   * Uploads a medical report document (PDF, PNG, JPG)
   * POST /api/reports/upload
   */
  async uploadFile(file, language = 'english') {
    if (USE_REAL_BACKEND) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', language);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail?.message || 'File upload failed');
      }
      return response.json();
    }

    // Mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          reportId: 'rep_mock_001',
          filename: file.name,
          fileType: file.name.split('.').pop()?.toLowerCase() || 'pdf',
          fileSizeBytes: file.size || 1024 * 500,
          status: 'uploaded',
          message: 'Report uploaded successfully and ready for analysis.',
        });
      }, 500);
    });
  },

  /**
   * Submits pasted raw medical report text
   * POST /api/reports/upload-text
   */
  async uploadText(text, reportName = 'Pasted Medical Report', language = 'english') {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/upload-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, reportName, language }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail?.message || 'Text processing failed');
      }
      return response.json();
    }

    // Mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockReports[0]);
      }, 600);
    });
  },

  /**
   * Fetches full structured report details
   * GET /api/reports/{id}?language={lang}
   */
  async getReport(reportId, language = 'english') {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/${reportId}?language=${language}`);
      if (!response.ok) {
        throw new Error('Report not found');
      }
      return response.json();
    }

    return new Promise((resolve) => {
      const match = mockReports.find((r) => r.id === reportId) || mockReports[0];
      setTimeout(() => resolve(match), 300);
    });
  },

  /**
   * Regenerates simplified explanations in a new language
   * POST /api/reports/{id}/simplify?language={lang}
   */
  async simplifyReport(reportId, language = 'english') {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/${reportId}/simplify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      });
      if (!response.ok) {
        throw new Error('Simplification request failed');
      }
      return response.json();
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockReports[0]);
      }, 400);
    });
  },

  /**
   * Lists all previous reports for history
   * GET /api/reports
   */
  async listReports() {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${API_BASE_URL}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reports list');
      }
      return response.json();
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve(mockReports), 200);
    });
  },

  /**
   * Deletes a report
   * DELETE /api/reports/{id}
   */
  async deleteReport(reportId) {
    if (USE_REAL_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/${reportId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete report');
      }
      return response.json();
    }

    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, message: 'Report deleted' }), 300);
    });
  },
};
