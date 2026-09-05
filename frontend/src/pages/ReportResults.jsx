import React, { useState, useMemo } from 'react';
import {
  Calendar,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Table,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  HelpCircle,
  Stethoscope,
  ShieldCheck,
  Info,
} from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';
import FindingCard from '../components/common/FindingCard';
import ExplanationCard from '../components/common/ExplanationCard';
import Disclaimer from '../components/common/Disclaimer';
import {
  generateSimpleReportSummary,
  getTestDetailedExplanation,
  MEDICAL_DICTIONARY,
  getDictionaryKey,
} from '../utils/simplificationHelper';

export default function ReportResults({
  report,
  language = 'en',
  onNavigate,
  onViewDetails,
}) {
  const [findingCategory, setFindingCategory] = useState('needs_attention');
  const [expandedTableTestId, setExpandedTableTestId] = useState(null);

  if (!report) return null;

  // Generate plain-language summary structure
  const simpleSummary = useMemo(() => {
    return generateSimpleReportSummary(report, language);
  }, [report, language]);

  // Categorize all tests into the 3 UX groups
  const categorizedFindings = useMemo(() => {
    const tests = Array.isArray(report.tests) ? report.tests : [];
    const needsAttention = [];
    const worthDiscussing = [];
    const withinRange = [];

    tests.forEach((t) => {
      const status = (t.status || '').toLowerCase();
      if (status === 'high' || status === 'low') {
        needsAttention.push(t);
      } else if (status === 'unable_to_determine' || !status) {
        worthDiscussing.push(t);
      } else {
        withinRange.push(t);
      }
    });

    return {
      needs_attention: needsAttention,
      worth_discussing: worthDiscussing,
      within_range: withinRange,
      all: tests,
    };
  }, [report]);

  // Available tests for current category tab
  const activeFindingsList = useMemo(() => {
    if (findingCategory === 'needs_attention') {
      if (categorizedFindings.needs_attention.length === 0 && categorizedFindings.worth_discussing.length > 0) {
        return categorizedFindings.worth_discussing;
      }
      return categorizedFindings.needs_attention;
    }
    if (findingCategory === 'worth_discussing') {
      return categorizedFindings.worth_discussing;
    }
    if (findingCategory === 'within_range') {
      return categorizedFindings.within_range;
    }
    return categorizedFindings.all;
  }, [findingCategory, categorizedFindings]);

  const toggleTableTest = (id) => {
    setExpandedTableTestId((prev) => (prev === id ? null : id));
  };

  // Section titles based on language
  const textContent = {
    en: {
      simpleWordsTitle: 'Your Report in Simple Words',
      simpleWordsSubtitle: 'Educational overview translated from clinical laboratory data',
      overallSummaryTitle: 'Overall Summary',
      importantFindingsTitle: 'Important Findings',
      normalFindingsTitle: 'Normal Findings',
      valuesDiscussTitle: 'Values That May Need Discussion',
      keyTakeawaysTitle: 'Key Takeaways for Your Doctor Visit',
      findingsCategoryTitle: 'Important Findings & Biomarker Groups',
      catNeedsAttention: 'Needs Attention',
      catWorthDiscussing: 'Worth Discussing',
      catWithinRange: 'Within Reference Range',
      catAll: 'All Tests',
      tableTitle: 'Test Results Table',
      tableSubtitle: 'Click any row to reveal plain-language explanation and reference details',
      colTest: 'BIOMARKER / TEST',
      colResult: 'YOUR RESULT',
      colRange: 'NORMAL RANGE',
      colStatus: 'STATUS',
      colMeans: 'WHAT IT MEANS',
      aiExplanationTitle: 'Medical Terminology → Simple Meaning',
      aiExplanationSubtitle: 'Plain-language definitions of clinical terms found in this report',
      viewDetailsCTA: 'Want to view visual gauge dials and individual test metrics?',
      viewDetailsBtn: 'Open Detailed Report & Gauges',
    },
    hi: {
      simpleWordsTitle: 'आपकी रिपोर्ट सरल शब्दों में',
      simpleWordsSubtitle: 'क्लिनिकल प्रयोगशाला डेटा का सरल और समझने योग्य सारांश',
      overallSummaryTitle: 'समग्र सारांश',
      importantFindingsTitle: 'महत्वपूर्ण निष्कर्ष',
      normalFindingsTitle: 'सामान्य परिणाम',
      valuesDiscussTitle: 'मान जिन पर चर्चा की आवश्यकता हो सकती है',
      keyTakeawaysTitle: 'डॉक्टर से परामर्श के मुख्य बिंदु',
      findingsCategoryTitle: 'महत्वपूर्ण निष्कर्ष और श्रेणियां',
      catNeedsAttention: 'ध्यान देने योग्य',
      catWorthDiscussing: 'चर्चा योग्य',
      catWithinRange: 'सामान्य सीमा के भीतर',
      catAll: 'सभी परीक्षण',
      tableTitle: 'परीक्षण परिणाम तालिका',
      tableSubtitle: 'विस्तृत सरल व्याख्या देखने के लिए किसी भी पंक्ति पर क्लिक करें',
      colTest: 'परीक्षण / बायोमार्कर',
      colResult: 'आपका परिणाम',
      colRange: 'सामान्य सीमा',
      colStatus: 'स्थिति',
      colMeans: 'सरल अर्थ',
      aiExplanationTitle: 'चिकित्सा शब्दावली → सरल अर्थ',
      aiExplanationSubtitle: 'इस रिपोर्ट में पाए गए चिकित्सा शब्दों की आसान व्याख्या',
      viewDetailsCTA: 'क्या आप दृश्य गेज डायल और विस्तृत पैरामीटर देखना चाहते हैं?',
      viewDetailsBtn: 'विस्तृत रिपोर्ट और गेज देखें',
    },
    hinglish: {
      simpleWordsTitle: 'Your Report in Simple Words',
      simpleWordsSubtitle: 'Clinical lab report ka simple aur aasan bhasha me overview',
      overallSummaryTitle: 'Overall Summary',
      importantFindingsTitle: 'Important Findings',
      normalFindingsTitle: 'Normal Findings',
      valuesDiscussTitle: 'Values That May Need Discussion',
      keyTakeawaysTitle: 'Doctor Visit Ke Liye Key Takeaways',
      findingsCategoryTitle: 'Important Findings & Biomarker Categories',
      catNeedsAttention: 'Needs Attention',
      catWorthDiscussing: 'Worth Discussing',
      catWithinRange: 'Within Reference Range',
      catAll: 'All Tests',
      tableTitle: 'Test Results Table',
      tableSubtitle: 'Kisi bhi row par click karke simple explanation dekh sakte hain',
      colTest: 'BIOMARKER / TEST',
      colResult: 'YOUR RESULT',
      colRange: 'NORMAL RANGE',
      colStatus: 'STATUS',
      colMeans: 'WHAT IT MEANS',
      aiExplanationTitle: 'Medical Terminology → Simple Meaning',
      aiExplanationSubtitle: 'Report me aaye medical terms ka aasan aur saral matlab',
      viewDetailsCTA: 'Visual gauge dials aur deep metrics check karna chahte hain?',
      viewDetailsBtn: 'Open Detailed Report & Gauges',
    },
  }[language] || {
    simpleWordsTitle: 'Your Report in Simple Words',
    simpleWordsSubtitle: 'Educational overview translated from clinical laboratory data',
    overallSummaryTitle: 'Overall Summary',
    importantFindingsTitle: 'Important Findings',
    normalFindingsTitle: 'Normal Findings',
    valuesDiscussTitle: 'Values That May Need Discussion',
    keyTakeawaysTitle: 'Key Takeaways for Your Doctor Visit',
    findingsCategoryTitle: 'Important Findings & Biomarker Groups',
    catNeedsAttention: 'Needs Attention',
    catWorthDiscussing: 'Worth Discussing',
    catWithinRange: 'Within Reference Range',
    catAll: 'All Tests',
    tableTitle: 'Test Results Table',
    tableSubtitle: 'Click any row to reveal plain-language explanation and reference details',
    colTest: 'BIOMARKER / TEST',
    colResult: 'YOUR RESULT',
    colRange: 'NORMAL RANGE',
    colStatus: 'STATUS',
    colMeans: 'WHAT IT MEANS',
    aiExplanationTitle: 'Medical Terminology → Simple Meaning',
    aiExplanationSubtitle: 'Plain-language definitions of clinical terms found in this report',
    viewDetailsCTA: 'Want to view visual gauge dials and individual test metrics?',
    viewDetailsBtn: 'Open Detailed Report & Gauges',
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button
            onClick={() => onNavigate('dashboard')}
            className="hover:text-slate-900 transition-colors"
          >
            Dashboard
          </button>
          <span>/</span>
          <button
            onClick={() => onNavigate('history')}
            className="hover:text-slate-900 transition-colors"
          >
            Reports
          </button>
          <span>/</span>
          <span className="text-slate-900 font-bold">Report Results</span>
        </div>

        <button
          onClick={() => onViewDetails(report)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <span>{textContent.viewDetailsBtn}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 1. REPORT HEADER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <StatusBadge status={report.status} size="sm" />
              <span className="text-xs text-slate-400 font-medium">
                {report.labName || 'Laboratory Diagnostics'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {report.name || 'Medical Laboratory Report'}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Report Date: <strong className="text-slate-700">{report.date || 'Recent'}</strong>
              </span>
              <span>•</span>
              <span>
                Patient: <strong className="text-slate-700">{report.patientName || 'Verified Patient'}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-200/80 shrink-0 text-xs self-start sm:self-center">
            <div className="text-center px-2">
              <span className="text-slate-400 block font-medium">Tests</span>
              <span className="text-lg font-bold text-slate-900">{report.totalTests || report.tests?.length || 0}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-emerald-600 block font-medium">Normal</span>
              <span className="text-lg font-bold text-emerald-700">{report.normalCount || 0}</span>
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div className="text-center px-2">
              <span className="text-amber-600 block font-medium">Attention</span>
              <span className="text-lg font-bold text-amber-700">{report.abnormalCount || 0}</span>
            </div>
          </div>
        </div>

        {/* Short Summary Pill */}
        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          {typeof report.summary === 'object'
            ? report.summary[language] || report.summary.en
            : report.summary}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. PROMINENT SECTION: "YOUR REPORT IN SIMPLE WORDS"       */}
      {/* ======================================================== */}
      <section className="bg-gradient-to-br from-blue-50/70 via-white to-slate-50 rounded-3xl border border-blue-200/80 p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {textContent.simpleWordsTitle}
              </h2>
              <p className="text-xs text-slate-500">
                {textContent.simpleWordsSubtitle}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full shrink-0 shadow-xs uppercase tracking-wider">
            {language.toUpperCase()} SIMPLIFIED
          </span>
        </div>

        {/* A. Overall Simple Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600" />
            <span>{textContent.overallSummaryTitle}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-800 bg-white p-4 rounded-2xl border border-blue-100 shadow-xs leading-relaxed font-normal">
            {simpleSummary.overallSummary}
          </p>
        </div>

        {/* B. Important Findings (Out of Range) */}
        {simpleSummary.importantFindings && simpleSummary.importantFindings.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {textContent.importantFindingsTitle} ({simpleSummary.importantFindings.length})
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {simpleSummary.importantFindings.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3.5 rounded-2xl border border-amber-200/80 shadow-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      {item.name}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                      {item.status} ({item.result})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">
                    {item.whatItMeans}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* C. Normal Findings */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{textContent.normalFindingsTitle}</span>
          </h3>
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs sm:text-sm text-emerald-900 space-y-2">
            <p className="font-medium leading-relaxed">
              {simpleSummary.normalFindings.message}
            </p>
            {simpleSummary.normalFindings.tests.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  Tests:
                </span>
                {simpleSummary.normalFindings.tests.map((testName, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-white border border-emerald-200 text-emerald-800 text-xs font-medium"
                  >
                    {testName}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* D. Values that may need discussion (Unable to determine) */}
        {simpleSummary.discussionValues && simpleSummary.discussionValues.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {textContent.valuesDiscussTitle} ({simpleSummary.discussionValues.length})
              </span>
            </h3>
            <div className="space-y-2">
              {simpleSummary.discussionValues.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <span className="font-bold text-slate-900">
                    {item.name}: <span className="font-medium text-slate-600">{item.result}</span>
                  </span>
                  <span className="text-slate-500 italic text-[11px]">
                    {item.reason}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* E. Key Takeaways */}
        <div className="space-y-2 pt-2 border-t border-blue-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
            <span>{textContent.keyTakeawaysTitle}</span>
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {simpleSummary.keyTakeaways.map((takeaway, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. TEST RESULTS TABLE (5 Columns: BIOMARKER | RESULT | RANGE | STATUS | WHAT IT MEANS) */}
      {/* ======================================================== */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Table className="w-4 h-4 text-blue-600" />
              <span>{textContent.tableTitle}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {textContent.tableSubtitle}
            </p>
          </div>
          <span className="text-xs text-slate-400 font-medium self-start sm:self-auto">
            {report.tests?.length || 0} Biomarkers Total
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4 sm:px-6">{textContent.colTest}</th>
                <th className="py-3 px-4 whitespace-nowrap">{textContent.colResult}</th>
                <th className="py-3 px-4 whitespace-nowrap">{textContent.colRange}</th>
                <th className="py-3 px-4 whitespace-nowrap">{textContent.colStatus}</th>
                <th className="py-3 px-4 min-w-[200px]">{textContent.colMeans}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {report.tests?.map((test) => {
                const isRowExpanded = expandedTableTestId === test.id;
                const detail = getTestDetailedExplanation(test, language);
                const dictKey = getDictionaryKey(test.name);
                const dictEntry = dictKey ? MEDICAL_DICTIONARY[dictKey] : null;
                const quickMeaning = dictEntry
                  ? dictEntry.meaning[language === 'hi' ? 'hi' : language === 'hinglish' ? 'hinglish' : 'en']
                  : null;

                const displayRange = test.referenceRange && test.referenceRange !== 'Not Specified'
                  ? test.referenceRange
                  : 'Not Specified';

                return (
                  <React.Fragment key={test.id}>
                    <tr
                      onClick={() => toggleTableTest(test.id)}
                      className={`cursor-pointer transition-colors ${
                        isRowExpanded ? 'bg-blue-50/40' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="font-bold text-slate-900 break-words">
                          {test.name}
                        </div>
                        {quickMeaning && (
                          <div className="text-[11px] text-slate-500 font-normal truncate max-w-xs mt-0.5">
                            {quickMeaning}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                        {test.value}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          {test.unit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap font-medium">
                        {displayRange}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge status={test.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-normal line-clamp-1">
                            {detail.whatItMeans}
                          </span>
                          <span className="shrink-0 text-slate-400">
                            {isRowExpanded ? (
                              <ChevronUp className="w-4 h-4 text-blue-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Inline 6-point breakdown row */}
                    {isRowExpanded && (
                      <tr>
                        <td colSpan={5} className="p-0 bg-slate-50/70 border-b border-slate-200">
                          <div className="p-4 sm:p-5">
                            <FindingCard finding={test} language={language} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. IMPORTANT FINDINGS UX WITH 3 CATEGORY TABS           */}
      {/* ======================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{textContent.findingsCategoryTitle}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Categorized based on extracted clinical values and reference ranges
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto text-xs font-semibold flex-wrap">
            <button
              onClick={() => setFindingCategory('needs_attention')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                findingCategory === 'needs_attention'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {textContent.catNeedsAttention} ({categorizedFindings.needs_attention.length})
            </button>
            <button
              onClick={() => setFindingCategory('worth_discussing')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                findingCategory === 'worth_discussing'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {textContent.catWorthDiscussing} ({categorizedFindings.worth_discussing.length})
            </button>
            <button
              onClick={() => setFindingCategory('within_range')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                findingCategory === 'within_range'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {textContent.catWithinRange} ({categorizedFindings.within_range.length})
            </button>
            <button
              onClick={() => setFindingCategory('all')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                findingCategory === 'all'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {textContent.catAll} ({categorizedFindings.all.length})
            </button>
          </div>
        </div>

        {activeFindingsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeFindingsList.map((item) => (
              <FindingCard
                key={item.id || item.testName || item.name}
                finding={item}
                language={language}
              />
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>No items in this category:</strong> All parameters in this selection meet balanced clinical criteria.
            </span>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 5. MEDICAL TERMINOLOGY → SIMPLE MEANING (AI EXPLANATIONS) */}
      {/* ======================================================== */}
      {report.aiExplanations && report.aiExplanations.length > 0 && (
        <section className="space-y-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>{textContent.aiExplanationTitle}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {textContent.aiExplanationSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.aiExplanations.map((item) => (
              <ExplanationCard
                key={item.id}
                item={item}
                language={language}
              />
            ))}
          </div>
        </section>
      )}

      {/* View Detailed Report Action Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-soft">
        <div className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
          {textContent.viewDetailsCTA}
        </div>
        <button
          onClick={() => onViewDetails(report)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0"
        >
          <span>{textContent.viewDetailsBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 6. CLEAR MEDICAL DISCLAIMER */}
      <Disclaimer />
    </div>
  );
}
