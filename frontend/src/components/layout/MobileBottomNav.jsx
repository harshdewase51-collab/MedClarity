import React from 'react';
import {
  LayoutDashboard,
  UploadCloud,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';

export default function MobileBottomNav({
  currentPage,
  onNavigate,
  theme = 'light',
  onToggleTheme,
  hasActiveReport = false,
}) {
  const isDark = theme === 'dark';

  const navTabs = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
    },
    {
      id: 'upload',
      label: 'Upload',
      icon: UploadCloud,
      highlight: true,
    },
    ...(hasActiveReport
      ? [
          {
            id: 'results',
            label: 'Result',
            icon: Sparkles,
          },
        ]
      : []),
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-t border-slate-200 dark:border-neutral-800 px-3 py-2 transition-colors duration-200 shadow-lg"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            currentPage === tab.id ||
            (tab.id === 'upload' && currentPage === 'processing') ||
            (tab.id === 'results' && (currentPage === 'results' || currentPage === 'details'));

          if (tab.highlight) {
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center justify-center -mt-5 px-3 py-1.5 rounded-full shadow-md transition-all active:scale-95 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-950'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold mt-0.5">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">{tab.label}</span>
            </button>
          );
        })}

        {/* White / Dark Mode Toggle Button in Mobile Nav */}
        <button
          onClick={() => onToggleTheme?.(isDark ? 'light' : 'dark')}
          title={isDark ? 'Switch to White Mode' : 'Switch to Dark Mode'}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all cursor-pointer"
          aria-label={isDark ? 'Switch to White Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="w-5 h-5 text-blue-400 transition-transform hover:-rotate-12" />
          )}
          <span className="text-[10px] font-bold mt-0.5">
            {isDark ? 'White' : 'Dark'}
          </span>
        </button>
      </div>
    </nav>
  );
}
