import React from 'react';
import {
  Menu,
  UploadCloud,
  FileHeart,
} from 'lucide-react';
import LanguageSelector from '../common/LanguageSelector';

export default function Header({
  onOpenSidebar,
  onNavigate,
  language = 'en',
  onLanguageChange,
}) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand */}
        <div
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer md:hidden"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <FileHeart className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900 tracking-tight">
            Medical Report Simplifier
          </span>
        </div>
      </div>

      {/* Right controls: Language Selector + Upload Button */}
      <div className="flex items-center gap-2 sm:gap-3">
        <LanguageSelector
          currentLanguage={language}
          onLanguageChange={onLanguageChange}
        />

        <button
          onClick={() => onNavigate('upload')}
          className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
        >
          <UploadCloud className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">Upload New Report</span>
          <span className="sm:hidden">Upload</span>
        </button>
      </div>
    </header>
  );
}
