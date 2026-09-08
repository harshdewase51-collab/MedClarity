import React, { useState, useMemo } from 'react';
import {
  Calendar,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Stethoscope,
  ShieldCheck,
  Printer,
  UploadCloud,
  Check,
  TrendingDown,
  TrendingUp,
  HelpCircle,
  RotateCcw,
  Activity,
  Sliders,
  ShieldAlert,
  Zap,
} from 'lucide-react';
import Disclaimer from '../components/common/Disclaimer';
import StatusBadge from '../components/common/StatusBadge';
import {
  generateSimpleReportSummary,
  getTestDetailedExplanation,
} from '../utils/simplificationHelper';
import { samplePastedReportText } from '../data/mockReports';

// Market-First Innovative Features
import AudioReportPlayer from '../components/features/AudioReportPlayer';
import OrganBodyMap from '../components/features/OrganBodyMap';
import DoctorConsultPrep from '../components/features/DoctorConsultPrep';
import LifestyleSimulator from '../components/features/LifestyleSimulator';
import CautionRadar from '../components/features/CautionRadar';

export default function ReportResults({
  report,
  language = 'en',
  onNavigate,
  onClearSession,
  onStartProcessing,
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'organ_map' | 'doctor_prep' | 'lifestyle_sim' | 'caution_radar'

  if (!report) {
    return (
      <div className="min-h-[55vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4 bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-slate-200 dark:border-neutral-800 shadow-soft">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 dark:bg-neutral-800 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            No Active Medical Report
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed font-normal">
            MedClarity is a private, stateless tool. No past medical reports are saved or exposed publicly. Upload your lab test or try the demo below.
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
            <button
              onClick={() => onNavigate('upload')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Upload Report
            </button>
            <button
              onClick={() =>
                onStartProcessing?.({
                  name: 'Sample_CBC_Lab_Report.txt',
                  size: '1.4 KB',
                  type: 'Text Report Data',
                  rawText: samplePastedReportText,
                  source: 'text',
                })
              }
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 text-slate-700 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-800 text-xs font-bold transition-all cursor-pointer"
            >
              Try Sample Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Generate plain-language summary structure
  const simpleSummary = useMemo(() => {
    return generateSimpleReportSummary(report, language);
  }, [report, language]);

  const testsList = useMemo(() => {
    return Array.isArray(report.tests) ? report.tests : [];
  }, [report]);

  const statusLabel = (report.status || 'normal').toLowerCase();
  const isOverallAttention =
    statusLabel === 'attention' ||
    statusLabel === 'abnormal' ||
    simpleSummary.abnormalCount > 0;

  // Localized section titles
  const textContent = {
    en: {
      summaryTitle: 'Overall Summary',
      resultsTitle: 'Your Test Results & Explanations',
      resultsSubtitle: 'Each biomarker explained in plain, easy-to-understand words',
      yourResult: 'Your Result',
      normalRange: 'Normal Limits',
      whatItMeans: 'What this means',
      whatToAsk: 'Question for doctor',
      doctorNotesTitle: 'Important Notes for Your Doctor Visit',
      uploadAnother: 'Upload Another Report',
      printSave: 'Print / Save PDF',
      clearSession: 'Clear Screen',
    },
    hi: {
      summaryTitle: 'समग्र सारांश',
      resultsTitle: 'आपके परीक्षण परिणाम और सरल अर्थ',
      resultsSubtitle: 'प्रत्येक टेस्ट का आसान और स्पष्ट विवरण',
      yourResult: 'आपका परिणाम',
      normalRange: 'सामान्य सीमा',
      whatItMeans: 'इसका क्या अर्थ है',
      whatToAsk: 'डॉक्टर से क्या पूछें',
      doctorNotesTitle: 'डॉक्टर से मिलने के लिए मुख्य बिंदु',
      uploadAnother: 'दूसरी रिपोर्ट अपलोड करें',
      printSave: 'प्रिंट / सुरक्षित करें',
      clearSession: 'रिपोर्ट हटाएँ',
    },
    hinglish: {
      summaryTitle: 'Overall Summary',
      resultsTitle: 'Aapke Test Results & Simple Meaning',
      resultsSubtitle: 'Har test ka simple aur aasan bhasha me explanation',
      yourResult: 'Aapka Result',
      normalRange: 'Normal Limits',
      whatItMeans: 'Iska kya matlab hai',
      whatToAsk: 'Doctor se kya puchein',
      doctorNotesTitle: 'Doctor Visit Ke Liye Key Notes',
      uploadAnother: 'Dusri Report Upload Karein',
      printSave: 'Print / Save PDF',
      clearSession: 'Clear Screen',
    },
  }[language] || {
    summaryTitle: 'Overall Summary',
    resultsTitle: 'Your Test Results & Explanations',
    resultsSubtitle: 'Each biomarker explained in plain, easy-to-understand words',
    yourResult: 'Your Result',
    normalRange: 'Normal Limits',
    whatItMeans: 'What this means',
    whatToAsk: 'Question for doctor',
    doctorNotesTitle: 'Important Notes for Your Doctor Visit',
    uploadAnother: 'Upload Another Report',
    printSave: 'Print / Save PDF',
    clearSession: 'Clear Screen',
  };

  const navTabs = [
    { id: 'overview', label: 'Biomarkers & Summary', icon: Activity },
    { id: 'organ_map', label: 'Organ Impact Map', icon: Sparkles, badge: 'Interactive' },
    { id: 'doctor_prep', label: 'Doctor Prep & Brief', icon: Stethoscope, badge: 'AI Prep' },
    { id: 'lifestyle_sim', label: 'Lifestyle Simulator', icon: Sliders, badge: 'What-If' },
    { id: 'caution_radar', label: 'Caution Radar', icon: ShieldAlert, badge: 'Safety' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. REPORT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900 px-2.5 py-0.5 rounded-full">
              {report.labName || 'Diagnostic Report'}
            </span>
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isOverallAttention
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-900'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900'
              }`}
            >
              {isOverallAttention ? 'Needs Review' : 'All Clear'}
            </span>
          </div>

          <h1 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {report.name || report.reportName || 'Medical Laboratory Report'}
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-neutral-400 mt-1 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {report.date || report.reportDate || 'Recent'}
            </span>
            {report.patientName && (
              <span>Patient: <strong className="text-slate-700 dark:text-neutral-200">{report.patientName}</strong></span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{textContent.printSave}</span>
          </button>
          <button
            onClick={() => onNavigate('upload')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{textContent.uploadAnother}</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear this report from your screen and session?')) {
                onClearSession?.();
              }
            }}
            title="Wipe report from current session"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-neutral-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200 dark:hover:border-rose-900 text-xs font-bold transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{textContent.clearSession}</span>
          </button>
        </div>
      </div>

      {/* 2. AUDIO REPORT PLAYER (Zero-latency multilingual narration) */}
      <AudioReportPlayer report={report} language={language} />

      {/* 3. INNOVATION NAVIGATION TAB BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200 dark:border-neutral-800">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-neutral-900 text-slate-600 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white border-slate-200 dark:border-neutral-800 hover:bg-slate-50 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. ACTIVE TAB CONTENT RENDERING */}

      {/* TAB 1: OVERVIEW & BIOMARKERS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 shadow-soft space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
              <span>{textContent.summaryTitle}</span>
            </div>
            <p className="text-sm sm:text-base text-slate-800 dark:text-neutral-100 leading-relaxed font-normal">
              {simpleSummary.overall}
            </p>
          </div>

          {/* Biomarkers List */}
          <section className="space-y-3.5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {textContent.resultsTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-neutral-400">
                {textContent.resultsSubtitle}
              </p>
            </div>

            <div className="space-y-3">
              {testsList.map((test) => {
                const detail = getTestDetailedExplanation(test, language);
                const status = (test.status || 'unable_to_determine').toLowerCase();
                const isAttention =
                  status === 'low' ||
                  status === 'high' ||
                  status === 'attention' ||
                  status === 'abnormal';

                const displayRange =
                  test.referenceRange && test.referenceRange !== 'Not Specified'
                    ? test.referenceRange
                    : 'Not Specified';

                return (
                  <div
                    key={test.id || test.name}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      isAttention
                        ? 'bg-white dark:bg-neutral-900 border-amber-300 dark:border-amber-800/80 shadow-soft'
                        : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-soft'
                    }`}
                  >
                    {/* Header: Test Name & Status */}
                    <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-100 dark:border-neutral-800">
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                          {detail.name || test.name}
                        </h3>
                        {detail.categoryTag && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400">
                            {detail.categoryTag}
                          </span>
                        )}
                      </div>

                      <div className="shrink-0">
                        {status === 'low' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                            <TrendingDown className="w-3.5 h-3.5" />
                            <span>Low</span>
                          </span>
                        )}
                        {status === 'high' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>High</span>
                          </span>
                        )}
                        {status === 'normal' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                            <Check className="w-3.5 h-3.5" />
                            <span>Normal</span>
                          </span>
                        )}
                        {(status === 'unable_to_determine' || (!['low', 'high', 'normal'].includes(status))) && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-neutral-700">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Values & Normal Limits */}
                    <div className="grid grid-cols-2 gap-3 my-3 p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-100 dark:border-neutral-800 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-400 uppercase tracking-wider block">
                          {textContent.yourResult}
                        </span>
                        <span
                          className={`text-base sm:text-lg font-bold block mt-0.5 ${
                            status === 'low'
                              ? 'text-rose-600 dark:text-rose-400'
                              : status === 'high'
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-slate-900 dark:text-white'
                          }`}
                        >
                          {test.value} {test.unit || ''}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-400 uppercase tracking-wider block">
                          {textContent.normalRange}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-neutral-300 block mt-1">
                          {displayRange}
                        </span>
                      </div>
                    </div>

                    {/* Simple explanation */}
                    {detail.whatItMeans && (
                      <div
                        className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
                          isAttention
                            ? 'bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200'
                            : 'bg-slate-50 dark:bg-neutral-800/40 border border-slate-200/80 dark:border-neutral-800 text-slate-700 dark:text-neutral-300'
                        }`}
                      >
                        <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                          {textContent.whatItMeans}:
                        </span>
                        {detail.whatItMeans}
                      </div>
                    )}

                    {/* Question for doctor */}
                    {isAttention && detail.whatToDiscuss && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>{textContent.whatToAsk}:</strong> {detail.whatToDiscuss}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Key Notes */}
          {simpleSummary.keyTakeaways && simpleSummary.keyTakeaways.length > 0 && (
            <section className="bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200 dark:border-neutral-800 p-5 sm:p-6 shadow-soft space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{textContent.doctorNotesTitle}</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-neutral-300">
                {simpleSummary.keyTakeaways.map((takeaway, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 bg-slate-50 dark:bg-neutral-800/60 p-3 rounded-xl border border-slate-200/80 dark:border-neutral-800"
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {/* TAB 2: ORGAN IMPACT MAP */}
      {activeTab === 'organ_map' && (
        <OrganBodyMap report={report} language={language} />
      )}

      {/* TAB 3: DOCTOR PREP & CLINICIAN BRIEF */}
      {activeTab === 'doctor_prep' && (
        <DoctorConsultPrep report={report} language={language} />
      )}

      {/* TAB 4: LIFESTYLE & HABIT SIMULATOR */}
      {activeTab === 'lifestyle_sim' && (
        <LifestyleSimulator report={report} language={language} />
      )}

      {/* TAB 5: CAUTION RADAR */}
      {activeTab === 'caution_radar' && (
        <CautionRadar report={report} language={language} />
      )}

      {/* Medical Disclaimer */}
      <Disclaimer />
    </div>
  );
}
