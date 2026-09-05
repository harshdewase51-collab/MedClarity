import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileSearch,
  Activity,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
  FileHeart,
} from 'lucide-react';

export default function ProcessingPage({
  file,
  onComplete,
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
      description: 'Identifying test names, values, units, and ranges',
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

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setCurrentStepIndex(1);
      setProgressPercent(40);
    }, 700);

    const timer2 = setTimeout(() => {
      setCurrentStepIndex(2);
      setProgressPercent(65);
    }, 1600);

    const timer3 = setTimeout(() => {
      setCurrentStepIndex(3);
      setProgressPercent(85);
    }, 2600);

    const timer4 = setTimeout(() => {
      setCurrentStepIndex(4);
      setProgressPercent(100);
    }, 3600);

    const timer5 = setTimeout(() => {
      onComplete?.();
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <div className="max-w-xl mx-auto py-8 sm:py-12 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
          <FileHeart className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Processing Medical Report
        </h2>
        <p className="text-xs text-slate-500">
          Analyzing <strong className="text-slate-700">{file?.name || 'Report'}</strong>
        </p>
      </div>

      {/* Steps Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-5">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Progress</span>
            <span className="text-blue-600 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-400 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-2.5 pt-1">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-2xl transition-all ${
                  isCurrent
                    ? 'bg-blue-50/60 border border-blue-100'
                    : isCompleted
                    ? 'bg-white'
                    : 'opacity-40'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : isCurrent
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-400'
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
                          ? 'text-blue-900'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-blue-600">
                        In progress
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] font-bold text-emerald-600">
                        ✓ Done
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fast-forward for preview */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Est. ~4 seconds
          </span>

          <button
            onClick={onComplete}
            className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>Skip to Results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
