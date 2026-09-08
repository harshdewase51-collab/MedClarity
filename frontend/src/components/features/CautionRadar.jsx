import React, { useMemo } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Pill,
  Apple,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';

export default function CautionRadar({ report, language = 'en' }) {
  const tests = useMemo(() => {
    return Array.isArray(report?.tests) ? report.tests : [];
  }, [report]);

  const abnormalTests = useMemo(() => {
    return tests.filter((t) => {
      const s = (t.status || '').toLowerCase();
      return s === 'high' || s === 'low' || s === 'attention' || s === 'abnormal';
    });
  }, [tests]);

  // Identify medication & dietary sensitivities based on extracted abnormal biomarkers
  const cautionFlags = useMemo(() => {
    const flags = [];

    const hasElevatedLiver = abnormalTests.some((t) => {
      const n = (t.name || t.testName || '').toLowerCase();
      return (n.includes('alt') || n.includes('ast') || n.includes('sgpt') || n.includes('sgot')) && t.status === 'high';
    });

    const hasElevatedKidney = abnormalTests.some((t) => {
      const n = (t.name || t.testName || '').toLowerCase();
      return (n.includes('creatinine') || n.includes('urea') || n.includes('bun')) && t.status === 'high';
    });

    const hasElevatedSugar = abnormalTests.some((t) => {
      const n = (t.name || t.testName || '').toLowerCase();
      return (n.includes('glucose') || n.includes('sugar') || n.includes('hba1c')) && t.status === 'high';
    });

    const hasLowPlatelets = abnormalTests.some((t) => {
      const n = (t.name || t.testName || '').toLowerCase();
      return n.includes('platelet') && t.status === 'low';
    });

    const hasElevatedLipids = abnormalTests.some((t) => {
      const n = (t.name || t.testName || '').toLowerCase();
      return (n.includes('cholesterol') || n.includes('triglycerides')) && t.status === 'high';
    });

    const hasLowHemoglobin = abnormalTests.some((t) => {
      const n = (t.name || t.testName || '').toLowerCase();
      return (n.includes('hemoglobin') || n.includes('hb')) && t.status === 'low';
    });

    // 1. Liver caution
    if (hasElevatedLiver) {
      flags.push({
        id: 'liver_paracetamol',
        category: 'Medication',
        icon: Pill,
        trigger: 'Elevated ALT / SGPT (Liver Enzyme)',
        substance: 'Over-the-Counter Paracetamol / Acetaminophen & Alcohol',
        severity: 'high',
        reason: 'Paracetamol is metabolized directly through the liver. In the presence of elevated liver enzymes, excessive doses or concurrent alcohol intake can strain hepatocyte recovery.',
        advice: 'Limit over-the-counter painkiller dosages to strictly under physician-directed ceilings and avoid alcohol until liver enzymes normalize.',
      });
    }

    // 2. Kidney caution
    if (hasElevatedKidney) {
      flags.push({
        id: 'kidney_nsaids',
        category: 'Medication',
        icon: Pill,
        trigger: 'Elevated Serum Creatinine / Kidney Marker',
        substance: 'NSAID Painkillers (Ibuprofen, Naproxen, Diclofenac)',
        severity: 'high',
        reason: 'Non-steroidal anti-inflammatory drugs (NSAIDs) constrict renal afferent arterioles, reducing filtration blood flow and risking acute kidney strain.',
        advice: 'Consult your doctor for kidney-safe analgesics (such as topical options or monitored alternatives). Maintain steady hydration.',
      });
    }

    // 3. Low platelets caution
    if (hasLowPlatelets) {
      flags.push({
        id: 'platelets_aspirin',
        category: 'Medication',
        icon: Pill,
        trigger: 'Low Platelet Count (<1.5 lakh)',
        substance: 'Aspirin, Blood Thinners & High-Dose Vitamin E',
        severity: 'high',
        reason: 'Platelets form the foundation of blood clotting. Blood-thinning compounds significantly elevate risk of spontaneous nosebleeds, bruising, or gastrointestinal bleeding.',
        advice: 'Never take aspirin or blood thinners without direct physician approval. Avoid contact sports until platelet levels normalize.',
      });
    }

    // 4. Sugar & Dietary caution
    if (hasElevatedSugar) {
      flags.push({
        id: 'sugar_dietary',
        category: 'Dietary',
        icon: Apple,
        trigger: 'Elevated Blood Glucose / HbA1c',
        substance: 'High-Fructose Corn Syrup, Fruit Juices & Sweetened Cough Syrups',
        severity: 'medium',
        reason: 'Liquid carbohydrates and refined sucrose cause rapid insulin spikes that overwhelm pancreatic beta cells.',
        advice: 'Opt for whole fruits with fiber intact rather than pressed juices. Ask pharmacist for sugar-free alternatives if taking liquid medications.',
      });
    }

    // 5. Lipids caution
    if (hasElevatedLipids) {
      flags.push({
        id: 'lipids_dietary',
        category: 'Dietary',
        icon: Apple,
        trigger: 'Elevated Total Cholesterol or Triglycerides',
        substance: 'Commercial Reheated Frying Oils & Trans-Fatty Acids',
        severity: 'medium',
        reason: 'Reheated cooking oils and industrial trans-fats accelerate vascular endothelium oxidation and raise atherogenic LDL particles.',
        advice: 'Switch to cold-pressed mustard, olive, or sesame oils in modest quantities; substitute deep-fried snacks with roasted seeds or nuts.',
      });
    }

    // 6. Hemoglobin tea/calcium timing
    if (hasLowHemoglobin) {
      flags.push({
        id: 'iron_tannins',
        category: 'Dietary Timing',
        icon: Apple,
        trigger: 'Low Hemoglobin / Anemia Marker',
        substance: 'Tea / Coffee & Calcium Supplements Taken with Meals',
        severity: 'low',
        reason: 'Tannins in chai/coffee and calcium tablets bind to dietary non-heme iron in your gut, blocking up to 60% of iron absorption.',
        advice: 'Drink chai, coffee, or milk at least 1.5 to 2 hours away from iron-rich meals or iron supplements.',
      });
    }

    return flags;
  }, [abnormalTests]);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-slate-200 dark:border-neutral-800 p-5 sm:p-7 shadow-soft space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-neutral-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Safety & Drug Interaction Guardrails</span>
          </div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span>Medication & Dietary Sensitivity Radar</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-neutral-400">
            Cross-checks out-of-range biomarkers against everyday over-the-counter drugs and dietary habits.
          </p>
        </div>

        <span className="text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-xl border border-rose-200 dark:border-rose-900">
          {cautionFlags.length} Caution Alert{cautionFlags.length === 1 ? '' : 's'} Active
        </span>
      </div>

      {/* Cautions List or All-Clear State */}
      {cautionFlags.length === 0 ? (
        <div className="p-6 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
              No High-Risk Sensitivities Detected
            </h4>
            <p className="text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
              Your tested biomarkers do not currently flag common over-the-counter drug warnings or acute dietary contraindications. Always consult a physician before starting new medications.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cautionFlags.map((flag) => {
            const Icon = flag.icon;
            const isHigh = flag.severity === 'high';

            return (
              <div
                key={flag.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                  isHigh
                    ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/80 shadow-soft'
                    : 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/80 shadow-soft'
                }`}
              >
                {/* Header: Category Badge + Trigger */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1.5 rounded-lg text-xs ${
                        isHigh
                          ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                          : 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-400 block">
                        {flag.category} Caution
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {flag.substance}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      isHigh
                        ? 'bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-200'
                        : 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200'
                    }`}
                  >
                    {flag.severity}
                  </span>
                </div>

                {/* Trigger Marker */}
                <div className="text-[11px] text-slate-600 dark:text-neutral-300 bg-white/80 dark:bg-neutral-900/80 p-2.5 rounded-xl border border-slate-200/60 dark:border-neutral-800">
                  <strong>Triggered By:</strong> {flag.trigger}
                </div>

                {/* Clinical Mechanism & Practical Advice */}
                <p className="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed">
                  {flag.reason}
                </p>

                <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-xs font-medium text-slate-800 dark:text-neutral-200 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span><strong>Protective Action:</strong> {flag.advice}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
