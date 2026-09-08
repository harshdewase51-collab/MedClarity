import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  History,
  FileHeart,
  X,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export default function Sidebar({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  theme = 'light',
  onToggleTheme,
  hasActiveReport = false,
  onClearSession,
}) {
  const isDark = theme === 'dark';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'upload',
      label: 'Upload Report',
      icon: UploadCloud,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-black border-r border-slate-200 dark:border-neutral-800 flex flex-col transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 dark:border-neutral-800 flex items-center justify-between">
          <div
            onClick={() => {
              onNavigate('dashboard');
              onClose?.();
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <FileHeart className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight block leading-snug">
                MedClarity
              </span>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block -mt-0.5">
                Report Simplifier
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-neutral-800"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
            Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (item.id === 'upload' && currentPage === 'processing');

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose?.();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900'
                    : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-neutral-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}

          {/* Current Session Report view (Only visible when user actually uploaded a report in current session) */}
          {hasActiveReport && (
            <div className="pt-5 space-y-1">
              <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500">
                Current Analysis
              </div>

              <button
                onClick={() => {
                  onNavigate('results');
                  onClose?.();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  currentPage === 'results'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900'
                    : 'text-slate-600 dark:text-neutral-300 hover:bg-slate-50 dark:hover:bg-neutral-900 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Simplified Results</span>
              </button>

              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your current report from this session?')) {
                    onClearSession?.();
                    onClose?.();
                  }
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear Session Data</span>
              </button>
            </div>
          )}
        </div>



        {/* Privacy Reassurance Footer */}
        <div className="p-3.5 m-3 rounded-2xl bg-slate-50 dark:bg-neutral-900 border border-slate-200/80 dark:border-neutral-800 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-neutral-200">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>100% Private & Stateless</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
            No medical reports are saved or exposed publicly. Your analysis stays strictly in this session.
          </p>
        </div>
      </aside>
    </>
  );
}
