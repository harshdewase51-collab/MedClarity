import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import ProcessingPage from './pages/ProcessingPage';
import ReportResults from './pages/ReportResults';
import ReportDetails from './pages/ReportDetails';
import ReportHistory from './pages/ReportHistory';
import { reportService, normalizeReport } from './services/reportService';
import { mockReports } from './data/mockReports';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi' | 'hinglish'
  const [reports, setReports] = useState(() => mockReports.map(normalizeReport));
  const [activeReport, setActiveReport] = useState(() => normalizeReport(mockReports[0]));
  const [currentProcessingFile, setCurrentProcessingFile] = useState(null);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  // Load real report history on mount
  useEffect(() => {
    let isMounted = true;
    const fetchInitialReports = async () => {
      setIsLoadingReports(true);
      try {
        const liveReports = await reportService.listReports();
        if (isMounted && Array.isArray(liveReports) && liveReports.length > 0) {
          setReports(liveReports);
          setActiveReport(liveReports[0]);
        }
      } catch (err) {
        console.warn('Could not load reports on mount, keeping fallback:', err);
      } finally {
        if (isMounted) setIsLoadingReports(false);
      }
    };
    fetchInitialReports();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReport = (report) => {
    const normalized = normalizeReport(report);
    setActiveReport(normalized);
  };

  const handleStartProcessing = (fileOrText) => {
    setCurrentProcessingFile(fileOrText);
    setCurrentPage('processing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessingComplete = (processedReport) => {
    if (processedReport) {
      const normalized = normalizeReport(processedReport);
      setReports((prev) => [normalized, ...prev.filter((r) => r.id !== normalized.id)]);
      setActiveReport(normalized);
    }
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (report) => {
    const normalized = normalizeReport(report);
    setActiveReport(normalized);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic language translation
  const handleLanguageChange = async (newLang) => {
    setLanguage(newLang);
    if (!activeReport?.id) return;

    try {
      const updated = await reportService.simplifyReport(activeReport.id, newLang);
      if (updated) {
        setActiveReport(updated);
        setReports((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        );
      }
    } catch (err) {
      console.warn('Language switch via backend error, local language updated:', err);
    }
  };

  // Real report deletion
  const handleDeleteReport = async (reportId) => {
    try {
      await reportService.deleteReport(reportId);
      const updatedList = reports.filter((r) => r.id !== reportId && r.reportId !== reportId);
      setReports(updatedList);
      if (activeReport?.id === reportId || activeReport?.reportId === reportId) {
        setActiveReport(updatedList[0] || null);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Failed to delete report: ${err.message}`);
    }
  };

  // Compute live summary statistics for Dashboard
  const computedStats = {
    totalReports: reports.length,
    totalTestsAnalyzed: reports.reduce((acc, r) => acc + (r.totalTests || 0), 0),
    normalResultsCount: reports.reduce((acc, r) => acc + (r.normalCount || 0), 0),
    abnormalResultsCount: reports.reduce((acc, r) => acc + (r.abnormalCount || 0), 0),
    lastUpdated: reports[0]?.date || 'Recent',
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Language Selector and Upload CTA */}
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
          language={language}
          onLanguageChange={handleLanguageChange}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <Dashboard
              reports={reports}
              stats={computedStats}
              language={language}
              onNavigate={handleNavigate}
              onSelectReport={handleSelectReport}
            />
          )}

          {currentPage === 'upload' && (
            <UploadReport
              onStartProcessing={handleStartProcessing}
              onNavigate={handleNavigate}
              language={language}
            />
          )}

          {currentPage === 'processing' && (
            <ProcessingPage
              file={currentProcessingFile}
              language={language}
              onComplete={handleProcessingComplete}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'results' && (
            <ReportResults
              report={activeReport}
              language={language}
              onNavigate={handleNavigate}
              onViewDetails={handleViewDetails}
            />
          )}

          {currentPage === 'details' && (
            <ReportDetails
              report={activeReport}
              language={language}
              onNavigate={handleNavigate}
            />
          )}

          {currentPage === 'history' && (
            <ReportHistory
              reports={reports}
              language={language}
              onSelectReport={handleSelectReport}
              onNavigate={handleNavigate}
              onDeleteReport={handleDeleteReport}
            />
          )}
        </main>
      </div>
    </div>
  );
}
