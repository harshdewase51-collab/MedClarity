import React, { useState, useMemo } from 'react';
import {
  Search,
  Calendar,
  FileText,
  ChevronRight,
  UploadCloud,
  LayoutGrid,
  List,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import Disclaimer from '../components/common/Disclaimer';

export default function ReportHistory({
  reports,
  language = 'en',
  onSelectReport,
  onNavigate,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('list');

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchQuery =
        report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.labName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.orderingPhysician?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.date.toLowerCase().includes(searchQuery.toLowerCase());

      let matchStatus = true;
      if (statusFilter === 'normal') {
        matchStatus = report.status === 'normal';
      } else if (statusFilter === 'attention') {
        matchStatus = report.status === 'attention';
      }

      return matchQuery && matchStatus;
    });
  }, [reports, searchQuery, statusFilter]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <button
              onClick={() => onNavigate('dashboard')}
              className="hover:text-slate-900"
            >
              Dashboard
            </button>
            <span>/</span>
            <span className="text-slate-900 font-bold">Report History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Previous Medical Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View previously analyzed laboratory reports and AI simplified explanations.
          </p>
        </div>

        <button
          onClick={() => onNavigate('upload')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Report</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reports by name or lab..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Status tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({reports.length})
              </button>
              <button
                onClick={() => setStatusFilter('attention')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'attention'
                    ? 'bg-white text-amber-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Abnormal ({reports.filter((r) => r.status === 'attention').length})
              </button>
              <button
                onClick={() => setStatusFilter('normal')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  statusFilter === 'normal'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Normal ({reports.filter((r) => r.status === 'normal').length})
              </button>
            </div>

            {/* List vs Grid view */}
            <div className="hidden md:flex items-center p-1 bg-slate-100 rounded-xl text-slate-500">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'hover:text-slate-900'
                }`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'hover:text-slate-900'
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
          description="We couldn't find any reports matching your search query or status filter. Try clearing the filters or upload a new report."
          actionText="Upload Medical Report"
          onAction={() => onNavigate('upload')}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReports.map((report) => {
            const sum =
              typeof report.summary === 'object'
                ? report.summary[language] || report.summary.en
                : report.summary;

            return (
              <div
                key={report.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                      <FileText className="w-4 h-4" />
                    </div>
                    <StatusBadge status={report.status} size="sm" />
                  </div>

                  <div>
                    <h3
                      onClick={() => {
                        onSelectReport(report);
                        onNavigate('results');
                      }}
                      className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {report.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.labName}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {sum}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>Tests: <strong>{report.totalTests}</strong></span>
                    <span className="text-emerald-700">Normal: <strong>{report.normalCount}</strong></span>
                    <span className="text-amber-700">Abnormal: <strong>{report.abnormalCount}</strong></span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onSelectReport(report);
                      onNavigate('details');
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      onSelectReport(report);
                      onNavigate('results');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
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
        <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredReports.map((report) => {
              const sum =
                typeof report.summary === 'object'
                  ? report.summary[language] || report.summary.en
                  : report.summary;

              return (
                <div
                  key={report.id}
                  className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4
                          onClick={() => {
                            onSelectReport(report);
                            onNavigate('results');
                          }}
                          className="text-sm sm:text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer truncate"
                        >
                          {report.name}
                        </h4>
                        <StatusBadge status={report.status} size="sm" />
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {report.date}
                        </span>
                        <span>•</span>
                        <span>{report.labName}</span>
                        <span>•</span>
                        <span>{report.totalTests} tests ({report.normalCount} normal, {report.abnormalCount} abnormal)</span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-1 pt-0.5">
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
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        onSelectReport(report);
                        onNavigate('results');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <span>View Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
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
