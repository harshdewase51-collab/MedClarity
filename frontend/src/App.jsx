import React, { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import ProcessingPage from './pages/ProcessingPage';
import ReportResults from './pages/ReportResults';
import ReportDetails from './pages/ReportDetails';
import ReportHistory from './pages/ReportHistory';
import { mockReports, mockSummaryStats } from './data/mockReports';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi' | 'hinglish'
  const [reports, setReports] = useState(mockReports);
  const [activeReport, setActiveReport] = useState(mockReports[0]);
  const [currentProcessingFile, setCurrentProcessingFile] = useState(null);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectReport = (report) => {
    setActiveReport(report);
  };

  const handleStartProcessing = (fileOrText) => {
    setCurrentProcessingFile(fileOrText);
    setCurrentPage('processing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProcessingComplete = () => {
    // If user uploaded or pasted, display the primary detailed report
    setActiveReport(mockReports[0]);
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (report) => {
    setActiveReport(report);
    setCurrentPage('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          onLanguageChange={setLanguage}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {currentPage === 'dashboard' && (
            <Dashboard
              reports={reports}
              stats={mockSummaryStats}
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
              onComplete={handleProcessingComplete}
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
            />
          )}
        </main>
      </div>
    </div>
  );
}
