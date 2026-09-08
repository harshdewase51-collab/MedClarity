import React, { useState, useMemo } from 'react';
import {
  Activity,
  Heart,
  Droplet,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

/**
 * Organ definitions and biomarker matching dictionary
 */
const ORGAN_SYSTEMS = [
  {
    id: 'brain_thyroid',
    name: 'Thyroid & Endocrine Axis',
    icon: '🦋',
    coord: { x: 50, y: 15 }, // percentage coordinates
    biomarkerKeys: ['tsh', 'thyroid', 't3', 't4', 'free t3', 'free t4'],
    descriptions: {
      optimal: 'Thyroid hormone regulation and basal metabolic rate appear well-balanced.',
      attention: 'Thyroid or pituitary feedback markers show variations that may influence energy, weight, or mood.',
    },
  },
  {
    id: 'heart_lipids',
    name: 'Cardiovascular & Lipid Network',
    icon: '🫀',
    coord: { x: 45, y: 28 },
    biomarkerKeys: ['cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl', 'lipid'],
    descriptions: {
      optimal: 'Circulating lipid levels support clean arterial blood flow and heart health.',
      attention: 'Elevated lipid fractions (cholesterol or triglycerides) increase long-term vascular plaque risk.',
    },
  },
  {
    id: 'liver',
    name: 'Liver & Hepatic Detoxification',
    icon: '🪵',
    coord: { x: 42, y: 38 },
    biomarkerKeys: ['alt', 'sgpt', 'ast', 'sgot', 'bilirubin', 'alp', 'alkaline phosphatase', 'ggt', 'liver'],
    descriptions: {
      optimal: 'Hepatic enzymes indicate calm, undamaged liver cells with effective filtration.',
      attention: 'Elevated liver enzymes (ALT/AST) indicate cellular stress, common with fatty liver or medications.',
    },
  },
  {
    id: 'pancreas_metabolic',
    name: 'Pancreas & Blood Sugar Axis',
    icon: '🥞',
    coord: { x: 55, y: 42 },
    biomarkerKeys: ['glucose', 'sugar', 'fbs', 'ppbs', 'hba1c', 'insulin'],
    descriptions: {
      optimal: 'Insulin secretion and cellular glucose uptake are operating within target healthy limits.',
      attention: 'Elevated glycemic markers point to prediabetes, insulin resistance, or diabetes exposure.',
    },
  },
  {
    id: 'kidneys',
    name: 'Kidneys & Renal Filtration',
    icon: '🫘',
    coord: { x: 40, y: 48 },
    biomarkerKeys: ['creatinine', 'urea', 'bun', 'uric acid', 'egfr', 'kidney', 'renal'],
    descriptions: {
      optimal: 'Renal nephrons are effectively clearing metabolic waste products into urine.',
      attention: 'Serum creatinine or nitrogenous wastes suggest reduced filtration speed or dehydration.',
    },
  },
  {
    id: 'blood_marrow',
    name: 'Bone Marrow & Circulating Blood',
    icon: '🩸',
    coord: { x: 50, y: 62 },
    biomarkerKeys: ['hemoglobin', 'hb', 'rbc', 'wbc', 'platelet', 'tlc', 'mcv', 'mch', 'mchc', 'pcv', 'hematocrit'],
    descriptions: {
      optimal: 'Red blood cell oxygen carriage, immune leukocytes, and clotting platelets are balanced.',
      attention: 'Blood cell counts show variations (e.g. low hemoglobin anemia or elevated WBC immune response).',
    },
  },
];

export default function OrganBodyMap({ report, language = 'en' }) {
  const [selectedOrganId, setSelectedOrganId] = useState('liver');

  const tests = useMemo(() => {
    return Array.isArray(report?.tests) ? report.tests : [];
  }, [report]);

  // Map tests to organ systems and compute status
  const organStates = useMemo(() => {
    return ORGAN_SYSTEMS.map((organ) => {
      // Find tests matching this organ
      const matchedTests = tests.filter((t) => {
        const name = (t.name || t.testName || '').toLowerCase();
        const medTerm = (t.medicalTerm || '').toLowerCase();
        const category = (t.category || '').toLowerCase();
        const organTag = (t.organ || '').toLowerCase();

        return organ.biomarkerKeys.some((k) =>
          name.includes(k) || medTerm.includes(k) || category.includes(k) || organTag.includes(k)
        );
      });

      const abnormalTests = matchedTests.filter((t) => {
        const s = (t.status || '').toLowerCase();
        return s === 'high' || s === 'low' || s === 'attention' || s === 'abnormal';
      });

      let status = 'no_data';
      if (matchedTests.length > 0) {
        status = abnormalTests.length > 0 ? 'attention' : 'optimal';
      }

      return {
        ...organ,
        matchedTests,
        abnormalTests,
        status,
      };
    });
  }, [tests]);

  const activeOrgan = organStates.find((o) => o.id === selectedOrganId) || organStates[0];

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200 dark:border-neutral-800 p-5 sm:p-7 shadow-soft space-y-6 transition-colors">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/80 dark:border-blue-900">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Market-First Interactive Diagnostic Visualizer</span>
          </div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Anatomical Organ Impact Map</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Click any organ node to view localized physiological status and correlated biomarkers.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600 dark:text-neutral-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
            <span>Optimal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-950 animate-pulse" />
            <span>Needs Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-neutral-700" />
            <span>Not Tested</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid: Anatomical Body Graphic + Organ Detail Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Anatomical Visual Silhouette with interactive pulsing hotspots */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50/40 dark:from-neutral-900 dark:to-neutral-950 border border-slate-200/80 dark:border-neutral-800 relative min-h-[380px]">
          {/* Stylized Body Silhouette Graphic */}
          <div className="relative w-48 h-84 flex items-center justify-center select-none">
            <svg
              viewBox="0 0 200 400"
              className="w-full h-full drop-shadow-sm transition-all"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Human Head & Torso outline */}
              <path
                d="M100 20 C85 20 75 35 75 52 C75 70 85 82 93 88 C70 94 50 115 45 145 C42 165 40 210 38 250 C37 265 48 275 60 272 C68 270 70 255 72 235 L75 220 L75 360 C75 375 88 385 100 385 C112 385 125 375 125 360 L125 220 L128 235 C130 255 132 270 140 272 C152 275 163 265 162 250 C160 210 158 165 155 145 C150 115 130 94 107 88 C115 82 125 70 125 52 C125 35 115 20 100 20 Z"
                className="fill-slate-200/80 dark:fill-neutral-800/90 stroke-slate-300 dark:stroke-neutral-700"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Spine/Central axis subtle glow line */}
              <line
                x1="100"
                y1="90"
                x2="100"
                y2="240"
                stroke="currentColor"
                strokeDasharray="3 3"
                className="text-slate-300 dark:text-neutral-700"
                strokeWidth="1.5"
              />
            </svg>

            {/* Hotspots mapped over the anatomical silhouette */}
            {organStates.map((organ) => {
              const isSelected = organ.id === selectedOrganId;
              const hasAlert = organ.status === 'attention';
              const isNormal = organ.status === 'optimal';

              return (
                <button
                  key={organ.id}
                  onClick={() => setSelectedOrganId(organ.id)}
                  style={{
                    left: `${organ.coord.x}%`,
                    top: `${organ.coord.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`absolute z-10 p-1.5 rounded-full transition-all duration-300 cursor-pointer group flex items-center justify-center ${
                    isSelected
                      ? 'scale-125 ring-4 ring-blue-500 shadow-lg'
                      : 'hover:scale-115'
                  }`}
                  aria-label={organ.name}
                  title={`${organ.name} (${organ.status})`}
                >
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-md border ${
                      hasAlert
                        ? 'bg-amber-500 text-white border-amber-300 ring-2 ring-amber-400/50 animate-pulse'
                        : isNormal
                        ? 'bg-emerald-500 text-white border-emerald-300'
                        : 'bg-slate-300 dark:bg-neutral-700 text-slate-700 dark:text-neutral-200 border-slate-400 dark:border-neutral-600'
                    }`}
                  >
                    {organ.icon}
                  </span>

                  {/* Tooltip on hover */}
                  <span className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white dark:bg-white dark:text-slate-900 pointer-events-none shadow-sm">
                    {organ.name}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-[11px] text-slate-400 dark:text-neutral-500 mt-2 font-medium">
            Tap any organ marker on the body
          </span>
        </div>

        {/* Right: Detailed Organ Assessment Panel */}
        <div className="md:col-span-7 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-neutral-800/60 border border-slate-200/80 dark:border-neutral-700/80 space-y-4">
            {/* Active Organ Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 rounded-xl bg-white dark:bg-neutral-800 shadow-sm border border-slate-200 dark:border-neutral-700">
                  {activeOrgan.icon}
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {activeOrgan.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    {activeOrgan.matchedTests.length} relevant biomarker(s) found in your report
                  </p>
                </div>
              </div>

              <div>
                {activeOrgan.status === 'optimal' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Optimal</span>
                  </span>
                )}
                {activeOrgan.status === 'attention' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Needs Review</span>
                  </span>
                )}
                {activeOrgan.status === 'no_data' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400 border border-slate-200 dark:border-neutral-700">
                    <Info className="w-3.5 h-3.5" />
                    <span>Not in this panel</span>
                  </span>
                )}
              </div>
            </div>

            {/* Assessment Narrative */}
            <p className="text-xs sm:text-sm text-slate-700 dark:text-neutral-200 leading-relaxed">
              {activeOrgan.status === 'attention'
                ? activeOrgan.descriptions.attention
                : activeOrgan.status === 'optimal'
                ? activeOrgan.descriptions.optimal
                : 'No specific tests for this system were included in your uploaded report.'}
            </p>

            {/* Associated Biomarkers List */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400">
                Related Biomarkers in Report
              </h4>

              {activeOrgan.matchedTests.length === 0 ? (
                <div className="text-xs text-slate-500 dark:text-neutral-400 italic p-3 bg-white dark:bg-neutral-900 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                  This report does not contain specific measurements for {activeOrgan.name}. Ask your doctor if routine testing is warranted.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeOrgan.matchedTests.map((t) => {
                    const isAttn = (t.status || '').toLowerCase() !== 'normal';
                    return (
                      <div
                        key={t.id || t.name}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                          isAttn
                            ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60'
                            : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-bold text-slate-900 dark:text-white block truncate">
                            {t.name}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-neutral-400">
                            Normal: {t.referenceRange || 'Standard reference'}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`font-bold text-xs sm:text-sm block ${
                              isAttn
                                ? 'text-amber-700 dark:text-amber-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {t.value} {t.unit || ''}
                          </span>
                          <span
                            className={`text-[10px] font-semibold uppercase ${
                              isAttn ? 'text-amber-600' : 'text-emerald-600'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick System Selector Pills */}
            <div className="pt-2 border-t border-slate-200 dark:border-neutral-700 flex flex-wrap gap-1.5">
              {organStates.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setSelectedOrganId(o.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    o.id === selectedOrganId
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 border border-slate-200 dark:border-neutral-700'
                  }`}
                >
                  <span>{o.icon}</span>
                  <span>{o.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
