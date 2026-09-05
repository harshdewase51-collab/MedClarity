import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  BookOpen,
  Globe,
  Sliders,
  Bell,
  Trash2,
  Check,
  Info,
  Sparkles,
} from 'lucide-react';
import Disclaimer from '../components/common/Disclaimer';

export default function SettingsPage({
  onNavigate,
}) {
  const [readingLevel, setReadingLevel] = useState('simple'); // 'simple' | 'detailed'
  const [language, setLanguage] = useState('en');
  const [glossaryTooltips, setGlossaryTooltips] = useState(true);
  const [autoDeleteDays, setAutoDeleteDays] = useState('30');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button
            onClick={() => onNavigate('dashboard')}
            className="hover:text-slate-800"
          >
            Dashboard
          </button>
          <span>/</span>
          <span className="text-slate-800 font-bold">Settings</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Preferences & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Personalize how medical terms are translated and configure your data privacy controls.
        </p>
      </div>

      {/* AI Explanation Preferences */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200/80">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              AI Explanation Preferences
            </h2>
            <p className="text-xs text-slate-500">
              Adjust the simplicity and depth of the generated laboratory explanations.
            </p>
          </div>
        </div>

        {/* Reading Level Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Simplification Complexity
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => setReadingLevel('simple')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                readingLevel === 'simple'
                  ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-200/60 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">
                  Everyday Patient (Recommended)
                </span>
                {readingLevel === 'simple' && (
                  <span className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uses friendly metaphors, zero medical jargon, and focuses on what the numbers mean for daily life.
              </p>
            </div>

            <div
              onClick={() => setReadingLevel('detailed')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                readingLevel === 'detailed'
                  ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-200/60 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-slate-900">
                  Moderate Clinical Context
                </span>
                {readingLevel === 'detailed' && (
                  <span className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Includes physiological mechanisms, standard diagnostic thresholds, and specific organ pathways.
              </p>
            </div>
          </div>
        </div>

        {/* Language & Tooltip options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Explanation Language</span>
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-200"
            >
              <option value="en">English (US/UK)</option>
              <option value="es">Español (Spanish)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="fr">Français (French)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Interactive Medical Glossary</span>
            </label>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-600">
                Show inline explanations for complex terms
              </span>
              <input
                type="checkbox"
                checked={glossaryTooltips}
                onChange={(e) => setGlossaryTooltips(e.target.checked)}
                className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Data Management */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-soft space-y-6">
        <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200/80">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Privacy & Data Retention
            </h2>
            <p className="text-xs text-slate-500">
              Control how uploaded documents and results are handled in your browser.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div>
              <div className="text-xs font-bold text-slate-800">
                Automatic Report Expiration
              </div>
              <p className="text-[11px] text-slate-500">
                Purge processed reports and cached biomarkers automatically
              </p>
            </div>
            <select
              value={autoDeleteDays}
              onChange={(e) => setAutoDeleteDays(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="session">Delete on session close</option>
              <option value="7">Auto-delete after 7 days</option>
              <option value="30">Auto-delete after 30 days</option>
              <option value="never">Keep until manually deleted</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100">
            <div>
              <div className="text-xs font-bold text-rose-900">
                Clear Local Session Cache
              </div>
              <p className="text-[11px] text-rose-700">
                Permanently removes all uploaded files and cached analyses from this device.
              </p>
            </div>
            <button
              onClick={() => alert('Local cache cleared successfully.')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200/80 transition-colors shrink-0"
            >
              Clear Now
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
            <Check className="w-4 h-4" /> Preferences saved!
          </span>
        )}
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
        >
          Save Preferences
        </button>
      </div>

      {/* Disclaimer */}
      <Disclaimer />
    </div>
  );
}
