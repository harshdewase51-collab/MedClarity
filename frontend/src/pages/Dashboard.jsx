import React from 'react';
import {
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UploadCloud,
  Calendar,
  Sparkles,
  ChevronRight,
  ArrowDown,
  BookOpen,
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import FindingCard from '../components/common/FindingCard';
import StatusBadge from '../components/common/StatusBadge';
import Disclaimer from '../components/common/Disclaimer';

export default function Dashboard({
  reports,
  stats,
  language = 'en',
  onNavigate,
  onSelectReport,
}) {
  const latestReport = reports[0];

  const latestSummary =
    typeof latestReport?.summary === 'object'
      ? latestReport.summary[language] || latestReport.summary.en
      : latestReport?.summary;

  return (
    <div className="space-y-8 pb-12">
      {/* 2. MAIN HERO / INTRO: Clean, light and modern introduction section */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-soft">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Powered Medical Language Simplification</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Understand Your Medical Report in Simple Language
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
            Use AI to understand medical terms, test results and important findings in clear, easy-to-understand language.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onNavigate('upload')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Medical Report</span>
            </button>

            <button
              onClick={() => {
                onSelectReport(latestReport);
                onNavigate('results');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 shadow-soft transition-all cursor-pointer"
            >
              <span>View Latest Results</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. CORE PROBLEM-STATEMENT PREVIEW: Demonstrating Medical Term -> Simple Explanation */}
      <section className="bg-slate-50/80 rounded-3xl border border-slate-200/90 p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>How It Works — Core Translation Preview</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              We convert complicated clinical jargon into plain, everyday language.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 hidden sm:inline">
            Sample AI Translation
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-soft space-y-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Complex Medical Term
            </span>
            <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              Anemia
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
            <ArrowDown className="w-4 h-4" />
            <span>AI Simple Explanation</span>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            "A condition related to a lower-than-expected amount of hemoglobin in the blood. Hemoglobin carries oxygen to your cells, so lower levels can make you feel tired or fatigued."
          </div>
        </div>
      </section>

      {/* 3. QUICK OVERVIEW, BUT SUBTLE: Total Reports, Total Tests, Normal Results, Abnormal Results */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Quick Overview
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <StatCard
            title="Total Reports"
            value={stats.totalReports}
            subtitle="Analyzed reports"
            icon={FileText}
            iconColor="text-blue-600 bg-blue-50 border-blue-100"
          />
          <StatCard
            title="Total Tests"
            value={stats.totalTestsAnalyzed}
            subtitle="Tests evaluated"
            icon={Activity}
            iconColor="text-slate-600 bg-slate-100 border-slate-200"
          />
          <StatCard
            title="Normal Results"
            value={stats.normalResultsCount}
            subtitle="In standard range"
            icon={CheckCircle2}
            iconColor="text-emerald-600 bg-emerald-50 border-emerald-100"
            trend="Normal"
            trendType="positive"
          />
          <StatCard
            title="Abnormal Results"
            value={stats.abnormalResultsCount}
            subtitle="Outside reference range"
            icon={AlertTriangle}
            iconColor="text-amber-600 bg-amber-50 border-amber-100"
            trend="Attention"
            trendType="negative"
          />
        </div>
      </section>

      {/* 5. IMPORTANT FINDINGS */}
      {latestReport?.importantFindings && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Important Findings
              </h2>
              <p className="text-xs text-slate-500">
                Key test results outside the reference range
              </p>
            </div>
            <button
              onClick={() => {
                onSelectReport(latestReport);
                onNavigate('results');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestReport.importantFindings.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                language={language}
              />
            ))}
          </div>
        </section>
      )}

      {/* Latest Report Preview */}
      {latestReport && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  Latest Analyzed Report
                </span>
                <StatusBadge status={latestReport.status} size="sm" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {latestReport.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{latestReport.date}</span>
                <span>•</span>
                <span>{latestReport.labName}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectReport(latestReport);
                onNavigate('results');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors self-start sm:self-auto"
            >
              <span>Open Results</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-800 block mb-0.5 font-semibold">
              Summary:
            </strong>
            {latestSummary}
          </div>
        </section>
      )}

      {/* Clean Disclaimer */}
      <Disclaimer />
    </div>
  );
}
