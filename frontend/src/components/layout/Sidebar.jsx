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
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'upload',
      label: 'Upload Report',
      icon: UploadCloud,
      badge: null,
    },
    {
      id: 'history',
      label: 'Report History',
      icon: History,
      badge: '3',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
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
              <span className="font-bold text-sm text-slate-900 tracking-tight block leading-snug">
                Medical Report
              </span>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block -mt-0.5">
                Simplifier
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (item.id === 'upload' && currentPage === 'processing') ||
              (item.id === 'history' && (currentPage === 'results' || currentPage === 'details'));

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose?.();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Quick Views
          </div>

          <button
            onClick={() => {
              onNavigate('results');
              onClose?.();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Latest Report Results</span>
          </button>

          <button
            onClick={() => {
              onNavigate('details');
              onClose?.();
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Detailed Test View</span>
          </button>
        </div>

        {/* Reassurance Footer */}
        <div className="p-3.5 m-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Patient Privacy Assured</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Data is analyzed locally in your session.
          </p>
        </div>
      </aside>
    </>
  );
}
