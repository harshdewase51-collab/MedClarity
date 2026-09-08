import React from 'react';
import {
  Menu,
  UploadCloud,
  FileHeart,
  Sun,
  Moon,
} from 'lucide-react';
import LanguageSelector from '../common/LanguageSelector';

export default function Header({
  onOpenSidebar,
  onNavigate,
  language = 'en',
  onLanguageChange,
  theme = 'light',
  onToggleTheme,
}) {
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-slate-200 dark:border-neutral-800 px-3 sm:px-6 lg:px-8 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-xl text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 cursor-pointer md:hidden"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <FileHeart className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
            MedClarity
          </span>
        </div>
      </div>

      {/* Right controls: White/Dark Switcher + Language Selector + Upload Button */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Upper Taskbar White / Dark Mode Toggle */}
        <div className="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 text-xs font-bold">
          <button
            type="button"
            onClick={() => onToggleTheme?.('light')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              !isDark
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white'
            }`}
            title="Switch to White Mode"
          >
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">White</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleTheme?.('dark')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              isDark
                ? 'bg-black text-white shadow-sm border border-neutral-700'
                : 'text-slate-500 hover:text-slate-900'
            }`}
            title="Switch to Dark Mode"
          >
            <Moon className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Dark</span>
          </button>
        </div>

        <LanguageSelector
          currentLanguage={language}
          onLanguageChange={onLanguageChange}
        />

        <button
          onClick={() => onNavigate('upload')}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
        >
          <UploadCloud className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Upload Report</span>
          <span className="sm:hidden">Upload</span>
        </button>
      </div>
    </header>
  );
}
