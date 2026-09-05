import React from 'react';
import {
  Calendar,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Table,
  CheckCircle2,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import FindingCard from '../components/common/FindingCard';
import ExplanationCard from '../components/common/ExplanationCard';
import Disclaimer from '../components/common/Disclaimer';

export default function ReportResults({
  report,
  language = 'en',
  onNavigate,
  onViewDetails,
}) {
  if (!report) return null;

  const currentSummary =
    typeof report.summary === 'object'
      ? report.summary[language] || report.summary.en
      : report.summary;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button
            onClick={() => onNavigate('dashboard')}
            className="hover:text-slate-900"
          >
            Dashboard
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('history')}
            className="hover:text-slate-900"
          >
            Reports
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold">Report Results</span>
        </div>

        <button
          onClick={() => onViewDetails(report)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
        >
          <span>View Detailed Breakdown</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. REPORT HEADER & SUMMARY */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <StatusBadge status={report.status} size="sm" />
              <span className="text-xs text-slate-400 font-medium">
                {report.labName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {report.name}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Report Date: <strong className="text-slate-700">{report.date}</strong></span>
              <span>•</span>
              <span>Patient: <strong className="text-slate-700">{report.patientName}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-200/80 shrink-0 text-xs">
            <div className="text-center px-2">
              <span className="text-slate-400 block font-medium">Tests</span>
              <span className="text-lg font-bold text-slate-900">{report.totalTests}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-emerald-600 block font-medium">Normal</span>
              <span className="text-lg font-bold text-emerald-700">{report.normalCount}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-amber-600 block font-medium">Abnormal</span>
              <span className="text-lg font-bold text-amber-700">{report.abnormalCount}</span>
            </div>
          </div>
        </div>

        {/* Short Summary */}
        <div className="space-y-1.5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Report Summary
          </h2>
          <div className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {currentSummary}
          </div>
        </div>
      </div>

      {/* 2. TEST RESULTS TABLE (Test | Result | Reference Range | Status) */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Table className="w-4 h-4 text-blue-600" />
              <span>Test Results</span>
            </h2>
            <p className="text-xs text-slate-500">
              Clear breakdown of individual laboratory values and reference ranges
            </p>
          </div>
          <span className="text-xs text-slate-400">
            {report.tests?.length || 0} Biomarkers
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4 sm:px-6">Test</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Reference Range</th>
                <th className="py-3 px-4 text-right sm:text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {report.tests?.map((test) => (
                <tr
                  key={test.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                    {test.name}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                    {test.value}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      {test.unit}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {test.referenceRange}
                  </td>
                  <td className="py-3.5 px-4 text-right sm:text-left whitespace-nowrap">
                    <StatusBadge status={test.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. IMPORTANT FINDINGS */}
      {report.importantFindings && report.importantFindings.length > 0 ? (
        <section className="space-y-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Important Findings</span>
            </h2>
            <p className="text-xs text-slate-500">
              Biomarkers outside the standard reference range
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.importantFindings.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                language={language}
              />
            ))}
          </div>
        </section>
      ) : (
        <section className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>All results within normal bounds:</strong> Every biomarker in this report is within standard laboratory reference intervals. No abnormal findings were detected.
          </span>
        </section>
      )}

      {/* 4. AI SIMPLE EXPLANATION (Medical Term -> Simple Meaning -> Easy Explanation) */}
      {report.aiExplanations && report.aiExplanations.length > 0 && (
        <section className="space-y-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>AI Simple Explanation</span>
            </h2>
            <p className="text-xs text-slate-500">
              Understanding clinical terminology in plain language
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.aiExplanations.map((item) => (
              <ExplanationCard
                key={item.id}
                item={item}
                language={language}
              />
            ))}
          </div>
        </section>
      )}

      {/* View Detailed Report Action */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-soft">
        <div className="text-xs text-slate-600 text-center sm:text-left">
          Want to explore visual reference gauges and individual biomarker mechanisms?
        </div>
        <button
          onClick={() => onViewDetails(report)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
        >
          <span>View Detailed Medical Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 5. DISCLAIMER */}
      <Disclaimer />
    </div>
  );
}
