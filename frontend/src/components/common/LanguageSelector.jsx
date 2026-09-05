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
    <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
      <div className="pl-1.5 pr-0.5 text-slate-400 hidden sm:flex items-center">
        <Globe className="w-3.5 h-3.5" />
      </div>

      <div className="flex items-center gap-1">
        {languages.map((lang) => {
          const isActive = currentLanguage === lang.code;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => onLanguageChange?.(lang.code)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white text-blue-700 shadow-sm border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
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
