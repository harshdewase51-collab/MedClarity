import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import ReferenceGauge from '../components/common/ReferenceGauge';
import FindingCard from '../components/common/FindingCard';
import EmptyState from '../components/common/EmptyState';
import Disclaimer from '../components/common/Disclaimer';

export default function ReportDetails({
  report,
  language = 'en',
  onNavigate,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedIds, setExpandedIds] = useState(() => {
    return (report?.tests || [])
      .filter((t) => t.status !== 'normal')
      .map((t) => t.id);
  });

  if (!report) return null;

  const filteredTests = useMemo(() => {
    return (report.tests || []).filter((test) => {
      const matchQuery =
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (test.medicalTerm && test.medicalTerm.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchStatus = true;
      if (statusFilter === 'normal') {
        matchStatus = test.status === 'normal';
      } else if (statusFilter === 'attention') {
        matchStatus = test.status !== 'normal';
      }

      return matchQuery && matchStatus;
    });
  }, [report, searchQuery, statusFilter]);

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
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-soft"
            aria-label="Back to Results"
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
              {report.name} — Detailed Tests
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <button
            onClick={() => setExpandedIds((report.tests || []).map((t) => t.id))}
            className="font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
          >
            Expand All
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setExpandedIds([])}
            className="font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Important Findings section */}
      {report.importantFindings && report.importantFindings.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Important Findings Outside Reference Range</span>
          </h3>
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
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-soft space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by test name or medical term..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center p-1 bg-slate-100 rounded-xl shrink-0 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Tests ({report.tests?.length || 0})
            </button>
            <button
              onClick={() => setStatusFilter('attention')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'attention'
                  ? 'bg-white text-amber-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Abnormal ({report.abnormalCount})
            </button>
            <button
              onClick={() => setStatusFilter('normal')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'normal'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Normal ({report.normalCount})
            </button>
          </div>
        </div>
      </div>

      {/* Tests Results Detailed Cards */}
      {filteredTests.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Biomarkers Found"
          description="No tests match your search query or status filter. Try clearing your search keyword."
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
            const isAbnormal = test.status !== 'normal';

            const meaning =
              typeof test.simpleMeaning === 'object'
                ? test.simpleMeaning[language] || test.simpleMeaning.en
                : test.simpleMeaning;

            const explanation =
              typeof test.explanation === 'object'
                ? test.explanation[language] || test.explanation.en
                : test.explanation;

            return (
              <div
                key={test.id}
                className={`bg-white rounded-3xl border transition-all shadow-soft overflow-hidden ${
                  isAbnormal
                    ? 'border-amber-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Header Row */}
                <div
                  onClick={() => toggleExpand(test.id)}
                  className="p-5 sm:p-6 cursor-pointer hover:bg-slate-50/40 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4 select-none"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <StatusBadge status={test.status} size="sm" />
                      {test.medicalTerm && (
                        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          Medical Term: <strong>{test.medicalTerm}</strong>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {test.name}
                    </h3>

                    {meaning && (
                      <p className="text-xs text-slate-500">
                        Meaning: {meaning}
                      </p>
                    )}
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
                        Ref: {test.referenceRange || 'Not Specified'}
                      </div>
                    </div>

                    <button
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
                      aria-label={isExpanded ? 'Collapse test details' : 'Expand test details'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
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

                {/* Expandable Simple Explanation */}
                {isExpanded && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-2 bg-slate-50/40">
                    <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <strong className="text-slate-800 font-semibold block mb-0.5">
                        AI Simple Explanation:
                      </strong>
                      {explanation}
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
