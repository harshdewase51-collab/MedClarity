import React, { useState, useMemo } from 'react';
import {
  Stethoscope,
  HelpCircle,
  AlertTriangle,
  Printer,
  Copy,
  Check,
  FileText,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Clock,
} from 'lucide-react';

export default function DoctorConsultPrep({ report, language = 'en' }) {
  const [copied, setCopied] = useState(false);

  const tests = useMemo(() => {
    return Array.isArray(report?.tests) ? report.tests : [];
  }, [report]);

  const abnormalTests = useMemo(() => {
    return tests.filter((t) => {
      const s = (t.status || '').toLowerCase();
      return s === 'high' || s === 'low' || s === 'attention' || s === 'abnormal';
    });
  }, [tests]);

  // Tailored high-yield questions based on patient's specific out-of-range biomarkers
  const highYieldQuestions = useMemo(() => {
    const questions = [];

    abnormalTests.forEach((t) => {
      const name = (t.name || t.testName || '').toLowerCase();
      if (t.doctorQuestion) {
        questions.push({
          test: t.name,
          question: t.doctorQuestion,
          context: `Generated for ${t.name} (${t.value} ${t.unit || ''})`,
        });
        return;
      }

      if (name.includes('alt') || name.includes('ast') || name.includes('sgpt') || name.includes('sgot')) {
        questions.push({
          test: t.name,
          question: 'Are these liver enzyme elevations indicative of fatty liver, medication side effects, or viral exposure?',
          context: `Based on elevated ${t.name}`,
        });
      } else if (name.includes('glucose') || name.includes('sugar') || name.includes('hba1c')) {
        questions.push({
          test: t.name,
          question: 'Should we schedule an HbA1c test or consult a clinical nutritionist to address insulin resistance?',
          context: `Based on elevated blood glucose`,
        });
      } else if (name.includes('creatinine') || name.includes('urea') || name.includes('bun')) {
        questions.push({
          test: t.name,
          question: 'Would you recommend checking my eGFR and urine protein to verify renal filtration capacity?',
          context: `Based on kidney marker`,
        });
      } else if (name.includes('cholesterol') || name.includes('triglycerides')) {
        questions.push({
          test: t.name,
          question: 'Do you recommend starting lipid-lowering therapy or initiating a 90-day dietary trial first?',
          context: `Based on lipid profile`,
        });
      } else if (name.includes('hemoglobin') || name.includes('hb')) {
        questions.push({
          test: t.name,
          question: 'Could my fatigue be connected to this hemoglobin level, and should we test serum ferritin and B12?',
          context: `Based on hemoglobin count`,
        });
      } else if (name.includes('tsh') || name.includes('thyroid')) {
        questions.push({
          test: t.name,
          question: 'Should we order Free T3 and Free T4 antibodies to evaluate thyroid metabolism comprehensively?',
          context: `Based on TSH variance`,
        });
      } else {
        questions.push({
          test: t.name,
          question: `What is the clinical significance of this ${t.name} result (${t.value} ${t.unit || ''}), and should we recheck it?`,
          context: `Based on ${t.name}`,
        });
      }
    });

    // If report has no abnormal findings, provide smart preventative questions
    if (questions.length === 0) {
      questions.push(
        {
          test: 'Preventative Wellness',
          question: 'Since all current panel markers are within target ranges, when do you recommend my next routine screen?',
          context: 'Preventative Health',
        },
        {
          test: 'Diet & Vitals',
          question: 'Are there any dietary or cardiovascular goals I should prioritize to keep these numbers stable as I age?',
          context: 'Lifestyle Longevity',
        }
      );
    }

    return questions.slice(0, 4); // Top 4 high-yield questions
  }, [abnormalTests]);

  // Symptoms to mention if present
  const redFlagSymptoms = useMemo(() => {
    const list = [];
    const hasLiver = abnormalTests.some((t) => /alt|ast|sgpt|bilirubin/i.test(t.name));
    const hasKidney = abnormalTests.some((t) => /creatinine|urea|bun/i.test(t.name));
    const hasSugar = abnormalTests.some((t) => /glucose|sugar|hba1c/i.test(t.name));
    const hasBlood = abnormalTests.some((t) => /hemoglobin|hb|platelet|wbc/i.test(t.name));

    if (hasLiver) list.push('Unexplained nausea, loss of appetite, dark tea-colored urine, or right upper abdominal discomfort.');
    if (hasKidney) list.push('Puffiness or swelling in ankles/eyelids, changes in urination frequency, or foamy urine.');
    if (hasSugar) list.push('Increased thirst, frequent urination, sudden blurry vision, or slow wound healing.');
    if (hasBlood) list.push('Persistent fatigue, lightheadedness upon standing, shortness of breath on mild exertion, or unusual bruising.');

    if (list.length === 0) {
      list.push('Report any new chest tightness, shortness of breath, unexplained weight changes, or chronic fatigue.');
    }
    return list;
  }, [abnormalTests]);

  // Copyable telehealth brief text
  const clipboardText = useMemo(() => {
    let txt = `🩺 PATIENT CONSULTATION BRIEF\n`;
    txt += `Report: ${report?.name || 'Diagnostic Laboratory Report'}\n`;
    txt += `Date: ${report?.date || 'Recent'}\n`;
    txt += `Overall Status: ${abnormalTests.length > 0 ? `${abnormalTests.length} Biomarkers Out of Range` : 'All Tested Markers Normal'}\n\n`;

    if (abnormalTests.length > 0) {
      txt += `⚠️ OUT-OF-RANGE BIOMARKERS:\n`;
      abnormalTests.forEach((t) => {
        txt += `- ${t.name}: ${t.value} ${t.unit || ''} (Normal: ${t.referenceRange || 'Standard'})\n`;
      });
      txt += `\n`;
    }

    txt += `❓ QUESTIONS PREPARED FOR DOCTOR:\n`;
    highYieldQuestions.forEach((q, idx) => {
      txt += `${idx + 1}. ${q.question}\n`;
    });

    txt += `\n(Generated privately via MedClarity Medical Platform)`;
    return txt;
  }, [report, abnormalTests, highYieldQuestions]);

  const handleCopy = () => {
    navigator.clipboard.writeText(clipboardText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200 dark:border-neutral-800 p-5 sm:p-7 shadow-soft space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-900 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Doctor Visit Preparation</span>
          </div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Consultation Prep & Clinician Brief</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Make the most of your doctor appointment with tailored high-impact questions and a printable brief.
          </p>
        </div>

        {/* Action buttons: Copy & Print */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-200 text-xs font-bold transition-all cursor-pointer"
            title="Copy consultation brief for Telehealth or WhatsApp"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Brief!' : 'Copy Script'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Clinician Sheet</span>
          </button>
        </div>
      </div>

      {/* Main Grid: High-Yield Questions + Red Flag Watchlist */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column (7 cols): High Yield Questions */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Questions to Ask Your Doctor</span>
            </h3>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
              Personalized
            </span>
          </div>

          <div className="space-y-3">
            {highYieldQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-700/80 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide block">
                      {q.context}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                      "{q.question}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 cols): Symptoms Watchlist & Printable Preview */}
        <div className="md:col-span-5 space-y-4">
          {/* Symptoms to Mention */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Symptoms to Mention if You Feel Them</span>
            </h3>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
              Doctors diagnose by correlating test numbers with physical symptoms. Mention if you have experienced:
            </p>
            <ul className="space-y-2 text-xs text-amber-950 dark:text-amber-200">
              {redFlagSymptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Doctor Summary Card (Print Format Preview) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-neutral-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Clinician Snapshot</span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-neutral-500">Ready for Consultation</span>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-neutral-300 space-y-1 bg-white dark:bg-neutral-900 p-3 rounded-xl border border-slate-200/60 dark:border-neutral-800">
              <div><strong>Patient:</strong> {report?.patientName || 'Patient'}</div>
              <div><strong>Date:</strong> {report?.date || 'Recent'}</div>
              <div><strong>Tested Biomarkers:</strong> {tests.length} total ({abnormalTests.length} flagged)</div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-neutral-400 italic">
              Tip: Show this brief directly to your doctor or physician assistant at the start of your consultation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
