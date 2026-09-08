import React from 'react';
import { Globe } from 'lucide-react';

export default function LanguageSelector({
  currentLanguage = 'en',
  onLanguageChange,
}) {
  const languages = [
    { code: 'en', label: 'English', shortLabel: 'EN' },
    { code: 'hi', label: 'हिन्दी', shortLabel: 'HI' },
    { code: 'hinglish', label: 'Hinglish', shortLabel: 'HING' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-colors">
      <div className="pl-1.5 pr-0.5 text-slate-400 dark:text-slate-400 hidden sm:flex items-center">
        <Globe className="w-3.5 h-3.5" />
      </div>

      <div className="flex items-center gap-0.5 sm:gap-1">
        {languages.map((lang) => {
          const isActive = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onLanguageChange?.(lang.code)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm border border-slate-200 dark:border-slate-600 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50'
              }`}
            >
              <span className="hidden sm:inline">{lang.label}</span>
              <span className="sm:hidden">{lang.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
