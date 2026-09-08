import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  Stethoscope,
  HelpCircle,
  CheckCircle,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import ReferenceGauge from '../components/common/ReferenceGauge';
import FindingCard from '../components/common/FindingCard';
import EmptyState from '../components/common/EmptyState';
import Disclaimer from '../components/common/Disclaimer';
import {
  getTestDetailedExplanation,
  getDictionaryKey,
  MEDICAL_DICTIONARY,
} from '../utils/simplificationHelper';

export default function ReportDetails({
  report,
  language = 'en',
  onNavigate,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedIds, setExpandedIds] = useState(() => {
    return (report?.tests || [])
      .filter((t) => (t.status || '').toLowerCase() !== 'normal')
      .map((t) => t.id);
  });

  if (!report) return null;

  // Localized texts
  const labels = {
    en: {
      back: 'Back to Results',
      detailsTitle: 'Detailed Laboratory Analysis & Gauges',
      expandAll: 'Expand All',
      collapseAll: 'Collapse All',
      importantFindings: 'Important Findings Requiring Review',
      searchPlaceholder: 'Search biomarker by test name or term (e.g. ALT, Hemoglobin)...',
      filterAll: 'All Tests',
      filterAttention: 'Needs Attention',
      filterDiscuss: 'Worth Discussing',
      filterNormal: 'Within Range',
      simpleMeaning: 'Simple Meaning (What it measures)',
      whatItMeans: 'What this result means',
      whatToDiscuss: 'What to discuss with a doctor',
      referenceRange: 'Reference Range',
      yourResult: 'Your Extracted Result',
    },
    hi: {
      back: 'परिणामों पर वापस जाएं',
      detailsTitle: 'विस्तृत प्रयोगशाला विश्लेषण और गेज',
      expandAll: 'सभी खोलें',
      collapseAll: 'सभी बंद करें',
      importantFindings: 'समीक्षा योग्य महत्वपूर्ण निष्कर्ष',
      searchPlaceholder: 'परीक्षण नाम या चिकित्सा शब्द खोजें...',
      filterAll: 'सभी परीक्षण',
      filterAttention: 'ध्यान देने योग्य',
      filterDiscuss: 'चर्चा योग्य',
      filterNormal: 'सामान्य सीमा',
      simpleMeaning: 'सरल अर्थ (यह क्या मापता है)',
      whatItMeans: 'इस परिणाम का क्या मतलब है',
      whatToDiscuss: 'डॉक्टर से क्या चर्चा करें',
      referenceRange: 'मानक संदर्भ सीमा',
      yourResult: 'आपका निकाला गया परिणाम',
    },
    hinglish: {
      back: 'Back to Results',
      detailsTitle: 'Detailed Laboratory Analysis & Visual Gauges',
      expandAll: 'Expand All',
      collapseAll: 'Collapse All',
      importantFindings: 'Review Ke Liye Important Findings',
      searchPlaceholder: 'Search biomarker by name or term...',
      filterAll: 'All Tests',
      filterAttention: 'Needs Attention',
      filterDiscuss: 'Worth Discussing',
      filterNormal: 'Within Range',
      simpleMeaning: 'Simple Meaning (Ye kya measure karta hai)',
      whatItMeans: 'Is result ka kya matlab hai',
      whatToDiscuss: 'Doctor se kya discuss karein',
      referenceRange: 'Reference Range',
      yourResult: 'Aapka Extracted Result',
    },
  }[language] || {
    back: 'Back to Results',
    detailsTitle: 'Detailed Laboratory Analysis & Gauges',
    expandAll: 'Expand All',
    collapseAll: 'Collapse All',
    importantFindings: 'Important Findings Requiring Review',
    searchPlaceholder: 'Search biomarker by test name or term...',
    filterAll: 'All Tests',
    filterAttention: 'Needs Attention',
    filterDiscuss: 'Worth Discussing',
    filterNormal: 'Within Range',
    simpleMeaning: 'Simple Meaning (What it measures)',
    whatItMeans: 'What this result means',
    whatToDiscuss: 'What to discuss with a doctor',
    referenceRange: 'Reference Range',
    yourResult: 'Your Extracted Result',
  };

  const tests = useMemo(() => {
    return Array.isArray(report.tests) ? report.tests : [];
  }, [report]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => {
    setExpandedIds(tests.map((t) => t.id));
  };

  const handleCollapseAll = () => {
    setExpandedIds([]);
  };

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const name = (test.name || test.testName || '').toLowerCase();
      const term = (test.medicalTerm || '').toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || name.includes(q) || term.includes(q);

      const status = (test.status || '').toLowerCase();
      let matchesStatus = true;
      if (statusFilter === 'attention') {
        matchesStatus = status === 'high' || status === 'low' || status === 'attention' || status === 'abnormal';
      } else if (statusFilter === 'discuss') {
        matchesStatus = status === 'unable_to_determine' || !status;
      } else if (statusFilter === 'normal') {
        matchesStatus = status === 'normal';
      }

      return matchesSearch && matchesStatus;
    });
  }, [tests, searchQuery, statusFilter]);

  const attentionCount = tests.filter((t) => {
    const s = (t.status || '').toLowerCase();
    return s === 'high' || s === 'low' || s === 'attention' || s === 'abnormal';
  }).length;

  const discussCount = tests.filter((t) => {
    const s = (t.status || '').toLowerCase();
    return s === 'unable_to_determine' || !s;
  }).length;

  const normalCount = tests.filter((t) => (t.status || '').toLowerCase() === 'normal').length;

  const importantFindings = useMemo(() => {
    return tests.filter((t) => {
      const s = (t.status || '').toLowerCase();
      return s === 'high' || s === 'low' || s === 'attention' || s === 'abnormal';
    });
  }, [tests]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-10">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <button
            onClick={() => onNavigate('results')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{labels.back}</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {labels.detailsTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {report.name || 'Medical Laboratory Report'} • {report.date}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExpandAll}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            {labels.expandAll}
          </button>
          <button
            onClick={handleCollapseAll}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            {labels.collapseAll}
          </button>
        </div>
      </div>

      {/* Top Banner: Important Findings Highlights */}
      {importantFindings.length > 0 && (
        <section className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-900/60 rounded-3xl p-4 sm:p-6 shadow-soft space-y-3.5 transition-colors">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{labels.importantFindings} ({importantFindings.length})</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {importantFindings.slice(0, 4).map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                language={language}
              />
            ))}
          </div>
        </section>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-soft space-y-3.5 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
            />
          </div>

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl shrink-0 text-xs font-semibold flex-wrap gap-1 self-start sm:self-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {labels.filterAll} ({tests.length})
            </button>
            <button
              onClick={() => setStatusFilter('attention')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'attention'
                  ? 'bg-white dark:bg-slate-700 text-amber-800 dark:text-amber-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {labels.filterAttention} ({attentionCount})
            </button>
            <button
              onClick={() => setStatusFilter('discuss')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'discuss'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {labels.filterDiscuss} ({discussCount})
            </button>
            <button
              onClick={() => setStatusFilter('normal')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                statusFilter === 'normal'
                  ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {labels.filterNormal} ({normalCount})
            </button>
          </div>
        </div>
      </div>

      {/* Tests Results Detailed Cards */}
      {filteredTests.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Biomarkers Found"
          description="No tests match your search query or status filter. Try resetting your filter."
          actionText="Reset Filter"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="space-y-3.5">
          {filteredTests.map((test) => {
            const isExpanded = expandedIds.includes(test.id);
            const detail = getTestDetailedExplanation(test, language);
            const status = detail.status;
            const isAbnormal = status === 'high' || status === 'low' || status === 'attention' || status === 'abnormal';
            const isUnable = status === 'unable_to_determine';

            return (
              <div
                key={test.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl border transition-all shadow-soft overflow-hidden ${
                  isAbnormal
                    ? 'border-amber-200/90 dark:border-amber-900/60 hover:border-amber-300'
                    : isUnable
                    ? 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {/* Card Header Row */}
                <div
                  onClick={() => toggleExpand(test.id)}
                  className="p-4 sm:p-6 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-3.5 select-none"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <StatusBadge status={detail.status} size="sm" />
                      {test.medicalTerm && (
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          Term: <strong>{test.medicalTerm}</strong>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white break-words">
                      {detail.testName}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {detail.simpleMeaning}
                    </p>
                  </div>

                  {/* Values & Range */}
                  <div className="flex items-center justify-between md:justify-end gap-5 self-stretch md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-left md:text-right">
                      <div className="text-base sm:text-xl font-black text-slate-900 dark:text-white">
                        {test.value}{' '}
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {test.unit}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        Ref: {detail.referenceRange}
                      </div>
                    </div>

                    <button
                      className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Visual Reference Gauge */}
                <div className="px-4 sm:px-6 pb-4">
                  <ReferenceGauge
                    value={test.numericValue || test.value}
                    min={test.min}
                    max={test.max}
                    unit={test.unit}
                    status={test.status}
                  />
                </div>

                {/* Expandable Breakdown */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-6 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-800/40">
                    {/* Simple Meaning */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{labels.simpleMeaning}</span>
                      </span>
                      <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                        {detail.simpleMeaning}
                      </div>
                    </div>

                    {/* What this result means */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        {isAbnormal ? (
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        )}
                        <span>{labels.whatItMeans}</span>
                      </span>
                      <div
                        className={`p-3 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                          isAbnormal
                            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200/80 dark:border-amber-900/40 text-amber-950 dark:text-amber-200'
                            : isUnable
                            ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200'
                        }`}
                      >
                        {detail.whatItMeans}
                      </div>
                    </div>

                    {/* What to discuss with doctor */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{labels.whatToDiscuss}</span>
                      </span>
                      <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs sm:text-sm text-blue-950 dark:text-blue-200 leading-relaxed font-normal">
                        {detail.whatToDiscuss}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Clean Disclaimer */}
      <Disclaimer />
    </div>
  );
}
