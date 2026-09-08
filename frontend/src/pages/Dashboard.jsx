import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileCheck,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Activity,
  CheckCircle2,
  Heart,
  HelpCircle,
  FlaskConical,
} from 'lucide-react';
import Disclaimer from '../components/common/Disclaimer';
import { samplePastedReportText } from '../data/mockReports';

export default function Dashboard({
  language = 'en',
  onNavigate,
  onStartProcessing,
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      onStartProcessing?.({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type || 'Medical Document',
        source: 'file',
        rawFile: file,
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onStartProcessing?.({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type || 'Medical Document',
        source: 'file',
        rawFile: file,
      });
    }
  };

  const handleTryDemo = () => {
    onStartProcessing?.({
      name: 'Sample_CBC_Lab_Report.txt',
      size: '1.4 KB',
      type: 'Text Report Data',
      rawText: samplePastedReportText,
      source: 'text',
    });
  };

  // Supported report types
  const supportedTests = [
    { title: 'Complete Blood Count', subtitle: 'Hemoglobin, RBC, WBC, Platelets', icon: FlaskConical },
    { title: 'Lipid & Heart Profile', subtitle: 'Cholesterol, Triglycerides, HDL, LDL', icon: Heart },
    { title: 'Liver & Kidney (LFT/KFT)', subtitle: 'Bilirubin, SGOT, SGPT, Creatinine, Urea', icon: Activity },
    { title: 'Diabetes & Thyroid', subtitle: 'HbA1c, Fasting Glucose, T3, T4, TSH', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* 1. HERO SECTION: Clean, Public & Welcoming */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-8 lg:p-10 shadow-soft transition-colors">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-semibold border border-blue-100 dark:border-blue-800/80">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Free Public Tool • No Login Required</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Understand Your Medical Report in Simple Words
          </h1>

          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Upload any lab test report (PDF, photo, or scan) and get instant, patient-friendly explanations in plain English, Hindi, or Hinglish.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              100% Private — Processed in your browser session
            </span>
          </div>
        </div>
      </div>

      {/* 2. DIRECT UPLOAD & DEMO CARD ON HOMEPAGE */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-soft space-y-5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Simplify a Medical Report
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your document or test right away with a sample report.
            </p>
          </div>

          <button
            onClick={handleTryDemo}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Sample Report (CBC Demo)</span>
          </button>
        </div>

        {/* Dropzone Box */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg,image/jpg"
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
            dragActive
              ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
            <UploadCloud className="w-6 h-6" />
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
            Click to Upload or Drag & Drop Report
          </h3>

          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
            Supports PDF lab reports, PNG, or JPG lab scans (max 25 MB)
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm cursor-pointer"
            >
              Browse Files
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate('upload');
              }}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs cursor-pointer"
            >
              Paste Text Instead
            </button>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 Simple Steps) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-soft space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-100 dark:border-blue-800">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Upload Your Lab Report
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Upload a digital PDF from your diagnostic center, take a photo of your paper test, or paste text.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-soft space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-100 dark:border-blue-800">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Extracts & Analyzes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Clinical parsing identifies test names, numeric values, units, and compares them against standard reference ranges.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-soft space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-100 dark:border-blue-800">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Read in Plain Words
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Get an educational summary in everyday language and helpful questions to discuss with your doctor.
            </p>
          </div>
        </div>
      </section>

      {/* 4. COMMON TESTS SUPPORTED */}
      <section className="bg-slate-50/80 dark:bg-slate-900/40 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 space-y-3.5 transition-colors">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Supported Diagnostic Reports
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            MedClarity can parse and explain a wide variety of routine diagnostic laboratory tests:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {supportedTests.map((test, i) => {
            const Icon = test.icon;
            return (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3.5 flex items-start gap-3 shadow-soft"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    {test.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {test.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Medical Disclaimer */}
      <Disclaimer />
    </div>
  );
}
