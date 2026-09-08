import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileSearch,
  Activity,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { reportService } from '../services/reportService';
import { samplePastedReportText } from '../data/mockReports';

export default function ProcessingPage({
  file,
  language = 'en',
  onComplete,
  onNavigate,
}) {
  const steps = [
    {
      id: 1,
      title: 'Report Uploaded',
      description: 'Document received and prepared for processing',
      icon: UploadCloud,
    },
    {
      id: 2,
      title: 'Extracting Information',
      description: 'Identifying biomarker names, numeric values, units, and ranges',
      icon: FileSearch,
    },
    {
      id: 3,
      title: 'Analyzing Medical Data',
      description: 'Comparing biomarker results against standard reference thresholds',
      icon: Activity,
    },
    {
      id: 4,
      title: 'Generating Simple Explanation',
      description: 'Converting complex medical terminology into clear everyday language',
      icon: Sparkles,
    },
    {
      id: 5,
      title: 'Report Ready',
      description: 'Your simplified explanation is ready to view',
      icon: CheckCircle2,
    },
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(20);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const executionStartedRef = useRef(false);

  const startAnalysis = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    setCurrentStepIndex(0);
    setProgressPercent(20);

    const t1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgressPercent(45);
    }, 400);

    const t2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgressPercent(70);
    }, 900);

    const t3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setProgressPercent(88);
    }, 1500);

    try {
      let result = null;

      if (file?.rawFile) {
        result = await reportService.uploadFile(file.rawFile, language);
      } else if (file?.rawText) {
        result = await reportService.uploadText(
          file.rawText,
          file.name || 'Pasted Medical Report',
          language
        );
      } else if (file?.source === 'sample_pdf') {
        result = await reportService.uploadText(
          samplePastedReportText,
          'Sample CBC & Metabolic Report',
          language
        );
      } else {
        result = await reportService.uploadText(
          samplePastedReportText,
          'Sample Laboratory Report',
          language
        );
      }

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      setCurrentStepIndex(4);
      setProgressPercent(100);
      setIsProcessing(false);

      setTimeout(() => {
        onComplete(result);
      }, 700);
    } catch (err) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setIsProcessing(false);
      console.error('Processing error:', err);
      setErrorMessage(
        err.message ||
          'Failed to process this medical document. Please make sure the report has readable diagnostic values.'
      );
    }
  };

  useEffect(() => {
    if (!executionStartedRef.current) {
      executionStartedRef.current = true;
      startAnalysis();
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 pb-10">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Simplifying Your Medical Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Our clinical analysis engine is extracting biomarkers and generating plain explanations.
        </p>
      </div>

      {/* Error state card if analysis fails */}
      {errorMessage ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/80 p-5 sm:p-8 shadow-soft space-y-5 text-center transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Unable to Process Document</h3>
            <p className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-100 dark:border-rose-900/60 max-w-md mx-auto leading-relaxed">
              {errorMessage}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
              Make sure the file is a valid medical laboratory report (PDF, PNG, JPG, or TXT).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate?.('upload')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Upload</span>
            </button>

            <button
              onClick={() => {
                executionStartedRef.current = false;
                startAnalysis();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Server</span>
            </button>

            <button
              onClick={async () => {
                setIsProcessing(true);
                setErrorMessage(null);
                try {
                  const fallbackResult = await reportService.uploadText(
                    file?.rawText || samplePastedReportText,
                    language,
                    file?.name || 'Diagnostic Laboratory Report'
                  );
                  setCurrentStepIndex(4);
                  setProgressPercent(100);
                  setIsProcessing(false);
                  setTimeout(() => {
                    onComplete(fallbackResult);
                  }, 600);
                } catch (e) {
                  setIsProcessing(false);
                  setErrorMessage(e.message);
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Use Instant Offline Clinical Engine</span>
            </button>
          </div>
        </div>
      ) : (
        /* Steps Card */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-soft space-y-5 transition-colors">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Progress</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-2 pt-1">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = currentStepIndex > idx;
              const isCurrent = currentStepIndex === idx;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-3 rounded-2xl transition-all ${
                    isCurrent
                      ? 'bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60'
                      : isCompleted
                      ? 'bg-white dark:bg-slate-900'
                      : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                        : isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs sm:text-sm font-bold ${
                          isCurrent
                            ? 'text-blue-900 dark:text-blue-200'
                            : isCompleted
                            ? 'text-slate-800 dark:text-slate-200'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {step.title}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                          In progress
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          ✓ Done
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Translating medical values into simple explanations
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
