import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  FileText,
  ChevronRight,
  UploadCloud,
  LayoutGrid,
  List,
  Trash2,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import Disclaimer from '../components/common/Disclaimer';

export default function ReportHistory({
  reports = [],
  language = 'en',
  onSelectReport,
  onNavigate,
  onDeleteReport,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');
  const [deletingId, setDeletingId] = useState(null);

  const filteredReports = useMemo(() => {
    return (reports || []).filter((report) => {
      const nameStr = (report.name || report.reportName || '').toLowerCase();
      const labStr = (report.labName || '').toLowerCase();
      const doctorStr = (report.orderingPhysician || '').toLowerCase();
      const dateStr = (report.date || report.reportDate || '').toLowerCase();
      const q = searchQuery.toLowerCase();

      const matchQuery =
        nameStr.includes(q) ||
        labStr.includes(q) ||
        doctorStr.includes(q) ||
        dateStr.includes(q);

      let matchStatus = true;
      if (statusFilter === 'normal') {
        matchStatus = report.status === 'normal';
      } else if (statusFilter === 'attention') {
        matchStatus = report.status === 'attention' || report.status === 'abnormal';
      }

      return matchQuery && matchStatus;
    });
  }, [reports, searchQuery, statusFilter]);

  const handleDelete = async (e, report) => {
    e.stopPropagation();
    const repName = report.name || report.reportName || 'this report';
    if (window.confirm(`Are you sure you want to delete "${repName}"? This will remove all extracted tests and explanations.`)) {
      try {
        setDeletingId(report.id || report.reportId);
        await onDeleteReport?.(report.id || report.reportId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <button
              onClick={() => onNavigate('dashboard')}
              className="hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Dashboard
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-bold">Report History</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Previous Medical Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            View previously analyzed laboratory reports and AI simplified explanations.
          </p>
        </div>

        <button
          onClick={() => onNavigate('upload')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors self-start sm:self-auto cursor-pointer"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Report</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-soft space-y-3.5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by name or lab..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* Status tabs */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All ({(reports || []).length})
              </button>
              <button
                onClick={() => setStatusFilter('attention')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'attention'
                    ? 'bg-white dark:bg-slate-700 text-amber-800 dark:text-amber-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Abnormal
              </button>
              <button
                onClick={() => setStatusFilter('normal')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'normal'
                    ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Normal
              </button>
            </div>

            {/* List vs Grid view (hidden on small mobile) */}
            <div className="hidden sm:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reports List / Grid */}
      {filteredReports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Medical Reports Found"
          description="We couldn't find any reports matching your search query or filter. Try clearing the filter or upload a new report."
          actionText="Upload Medical Report"
          onAction={() => onNavigate('upload')}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredReports.map((report) => {
            const sum =
              typeof report.summary === 'object'
                ? report.summary[language] || report.summary.en
                : report.summary;
            const repId = report.id || report.reportId;
            const isDeleting = deletingId === repId;

            return (
              <div
                key={repId}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-soft hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={report.status} size="sm" />
                      <button
                        onClick={(e) => handleDelete(e, report)}
                        disabled={isDeleting}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                        title="Delete report"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3
                      onClick={() => {
                        onSelectReport(report);
                        onNavigate('results');
                      }}
                      className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                    >
                      {report.name || report.reportName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{report.date || report.reportDate}</span>
                      <span>•</span>
                      <span>{report.labName}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {sum}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>Tests: <strong>{report.totalTests}</strong></span>
                    <span className="text-emerald-700 dark:text-emerald-400">Normal: <strong>{report.normalCount}</strong></span>
                    <span className="text-amber-700 dark:text-amber-400">Abnormal: <strong>{report.abnormalCount}</strong></span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onSelectReport(report);
                      onNavigate('details');
                    }}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      onSelectReport(report);
                      onNavigate('results');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                  >
                    <span>View Report</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-soft overflow-hidden transition-colors">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredReports.map((report) => {
              const sum =
                typeof report.summary === 'object'
                  ? report.summary[language] || report.summary.en
                  : report.summary;
              const repId = report.id || report.reportId;
              const isDeleting = deletingId === repId;

              return (
                <div
                  key={repId}
                  className="p-4 sm:p-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-3.5"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4
                          onClick={() => {
                            onSelectReport(report);
                            onNavigate('results');
                          }}
                          className="text-sm sm:text-base font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer truncate"
                        >
                          {report.name || report.reportName}
                        </h4>
                        <StatusBadge status={report.status} size="sm" />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                          {report.date || report.reportDate}
                        </span>
                        <span>•</span>
                        <span>{report.labName}</span>
                        <span>•</span>
                        <span>{report.totalTests} tests ({report.normalCount} normal, {report.abnormalCount} abnormal)</span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 pt-0.5">
                        {sum}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => {
                        onSelectReport(report);
                        onNavigate('details');
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        onSelectReport(report);
                        onNavigate('results');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                    >
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, report)}
                      disabled={isDeleting}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer ml-1"
                      title="Delete report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Medical Disclaimer */}
      <Disclaimer />
    </div>
  );
}
