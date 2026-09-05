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
  ShieldCheck,
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
      searchPlaceholder: 'परीक्षण नाम या चिकित्सा शब्द खोजें (जैसे ALT, हीमोग्लोबिन)...',
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
      searchPlaceholder: 'Search biomarker by name or term (e.g. ALT, Hemoglobin)...',
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
    simpleMeaning: 'Simple Meaning',
    whatItMeans: 'What this result means',
    whatToDiscuss: 'What to discuss with a doctor',
    referenceRange: 'Reference Range',
    yourResult: 'Your Result',
  };

  const tests = Array.isArray(report.tests) ? report.tests : [];

  const attentionCount = tests.filter((t) => {
    const s = (t.status || '').toLowerCase();
    return s === 'high' || s === 'low';
  }).length;

  const discussCount = tests.filter((t) => {
    const s = (t.status || '').toLowerCase();
    return s === 'unable_to_determine' || !s;
  }).length;

  const normalCount = tests.filter((t) => (t.status || '').toLowerCase() === 'normal').length;

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        (test.name && test.name.toLowerCase().includes(q)) ||
        (test.medicalTerm && test.medicalTerm.toLowerCase().includes(q));

      const status = (test.status || '').toLowerCase();
      let matchStatus = true;
      if (statusFilter === 'attention') {
        matchStatus = status === 'high' || status === 'low';
      } else if (statusFilter === 'discuss') {
        matchStatus = status === 'unable_to_determine' || !status;
      } else if (statusFilter === 'normal') {
        matchStatus = status === 'normal';
      }

      return matchQuery && matchStatus;
    });
  }, [tests, searchQuery, statusFilter]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('results')}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-soft transition-colors"
            aria-label={labels.back}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <button onClick={() => onNavigate('dashboard')} className="hover:text-slate-900">
                Dashboard
              </button>
              <span>/</span>
              <button onClick={() => onNavigate('results')} className="hover:text-slate-900">
                Results
              </button>
              <span>/</span>
              <span className="text-slate-900 font-bold">Detailed Report</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {report.name || 'Lab Report'} — {labels.detailsTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <button
            onClick={() => setExpandedIds(tests.map((t) => t.id))}
            className="font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {labels.expandAll}
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setExpandedIds([])}
            className="font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            {labels.collapseAll}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar with 3 categories */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-soft space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-2xl shrink-0 text-xs font-semibold flex-wrap gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {labels.filterAll} ({tests.length})
            </button>
            <button
              onClick={() => setStatusFilter('attention')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                statusFilter === 'attention'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {labels.filterAttention} ({attentionCount})
            </button>
            <button
              onClick={() => setStatusFilter('discuss')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                statusFilter === 'discuss'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {labels.filterDiscuss} ({discussCount})
            </button>
            <button
              onClick={() => setStatusFilter('normal')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                statusFilter === 'normal'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
        <div className="space-y-4">
          {filteredTests.map((test) => {
            const isExpanded = expandedIds.includes(test.id);
            const detail = getTestDetailedExplanation(test, language);
            const status = detail.status;
            const isAbnormal = status === 'high' || status === 'low';
            const isUnable = status === 'unable_to_determine';

            return (
              <div
                key={test.id}
                className={`bg-white rounded-3xl border transition-all shadow-soft overflow-hidden ${
                  isAbnormal
                    ? 'border-amber-200/90 hover:border-amber-300'
                    : isUnable
                    ? 'border-slate-200 hover:border-slate-300'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Header Row */}
                <div
                  onClick={() => toggleExpand(test.id)}
                  className="p-5 sm:p-6 cursor-pointer hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <StatusBadge status={detail.status} size="sm" />
                      {test.medicalTerm && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          Term: <strong>{test.medicalTerm}</strong>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 break-words">
                      {detail.testName}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2">
                      {detail.simpleMeaning}
                    </p>
                  </div>

                  {/* Values & Range */}
                  <div className="flex items-center gap-6 self-start md:self-center shrink-0">
                    <div className="text-right">
                      <div className="text-base sm:text-xl font-black text-slate-900">
                        {test.value}{' '}
                        <span className="text-xs font-medium text-slate-500">
                          {test.unit}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Ref: {detail.referenceRange}
                      </div>
                    </div>

                    <button
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-blue-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Visual Reference Gauge */}
                <div className="px-5 sm:px-6 pb-4">
                  <ReferenceGauge
                    value={test.numericValue || test.value}
                    min={test.min}
                    max={test.max}
                    unit={test.unit}
                    status={test.status}
                  />
                </div>

                {/* Expandable 6-Point Breakdown */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-3 border-t border-slate-100 space-y-3.5 bg-slate-50/50">
                    {/* 1. Simple Meaning */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-blue-600" />
                        <span>{labels.simpleMeaning}</span>
                      </span>
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                        {detail.simpleMeaning}
                      </div>
                    </div>

                    {/* 2. What this result means */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        {isAbnormal ? (
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                        <span>{labels.whatItMeans}</span>
                      </span>
                      <div
                        className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                          isAbnormal
                            ? 'bg-amber-50/60 border-amber-200 text-amber-950'
                            : isUnable
                            ? 'bg-white border-slate-200 text-slate-700'
                            : 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        {detail.whatItMeans}
                      </div>
                    </div>

                    {/* 3. What to discuss with doctor */}
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                        <span>{labels.whatToDiscuss}</span>
                      </span>
                      <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-xs sm:text-sm text-blue-950 leading-relaxed font-normal">
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
