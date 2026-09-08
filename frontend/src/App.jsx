import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MobileBottomNav from './components/layout/MobileBottomNav';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import ProcessingPage from './pages/ProcessingPage';
import ReportResults from './pages/ReportResults';
import ReportDetails from './pages/ReportDetails';
import { reportService, normalizeReport } from './services/reportService';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi' | 'hinglish'

  // Ephemeral, session-only reports for privacy. No public report history or mock leaks.
  const [reports, setReports] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [currentProcessingFile, setCurrentProcessingFile] = useState(null);

  // Theme Management (White Mode / Black Mode)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.style.colorScheme = 'dark';
      body.style.backgroundColor = '#000000';
      body.style.color = '#ffffff';
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.style.colorScheme = 'light';
      body.style.backgroundColor = '#ffffff';
      body.style.color = '#0f172a';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (explicitTheme) => {
    if (explicitTheme === 'dark' || explicitTheme === 'light') {
      setTheme(explicitTheme);
    } else {
      setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartProcessing = (fileOrText) => {
    setCurrentProcessingFile(fileOrText);
    setCurrentPage('processing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessingComplete = (processedReport) => {
    if (processedReport) {
      const normalized = normalizeReport(processedReport);
      setReports([normalized]);
      setActiveReport(normalized);
    }
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (report) => {
    if (report) {
      const normalized = normalizeReport(report);
      setActiveReport(normalized);
    }
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Clear session: resets all in-memory report data and returns to dashboard
  const handleClearSession = () => {
    setActiveReport(null);
    setReports([]);
    setCurrentProcessingFile(null);
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic language translation for active report
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-neutral-100 flex transition-colors duration-200">
      {/* Sidebar Navigation (Desktop & Tablet Drawer) */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        hasActiveReport={!!activeReport}
        onClearSession={handleClearSession}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Theme Switcher (White/Black), Language Selector, and Upload CTA */}
        <Header
          onOpenSidebar={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
          language={language}
          onLanguageChange={handleLanguageChange}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Content container - extra bottom padding on mobile for MobileBottomNav */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto pb-24 md:pb-10 transition-colors duration-200">
          {currentPage === 'dashboard' && (
            <Dashboard
              language={language}
              onNavigate={handleNavigate}
              onStartProcessing={handleStartProcessing}
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
              onClearSession={handleClearSession}
              onStartProcessing={handleStartProcessing}
            />
          )}

          {currentPage === 'details' && (
            <ReportDetails
              report={activeReport}
              language={language}
              onNavigate={handleNavigate}
              onClearSession={handleClearSession}
            />
          )}
        </main>
      </div>

      {/* Fixed Mobile Bottom Navigation Bar (< 768px) */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        theme={theme}
        onToggleTheme={toggleTheme}
        hasActiveReport={!!activeReport}
      />
    </div>
  );
}
