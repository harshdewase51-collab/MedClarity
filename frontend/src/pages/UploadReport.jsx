import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  X,
  FileCheck,
  ArrowRight,
  ClipboardPaste,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import Disclaimer from '../components/common/Disclaimer';
import { samplePastedReportText } from '../data/mockReports';

export default function UploadReport({
  onStartProcessing,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState('file'); // 'file' | 'text'
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const fileInputRef = useRef(null);

  const validateIncomingFile = (file) => {
    setErrorMessage(null);
    if (!file) return false;

    const allowedExtensions = ['pdf', 'png', 'jpg', 'jpeg'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (!allowedExtensions.includes(ext)) {
      setErrorMessage(
        `Unsupported file format ".${ext}". Please upload a valid laboratory report in PDF, PNG, or JPG format.`
      );
      return false;
    }

    const maxBytes = 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMessage(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds the 25 MB maximum allowed limit.`
      );
      return false;
    }

    if (file.size === 0) {
      setErrorMessage('The selected file is empty (0 bytes). Please select a valid report.');
      return false;
    }

    return true;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateIncomingFile(file)) {
        setSelectedFile({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type || 'Medical Document',
          source: 'file',
          rawFile: file,
        });
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateIncomingFile(file)) {
        setSelectedFile({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type || 'Medical Document',
          source: 'file',
          rawFile: file,
        });
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPastedText('');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSampleText = () => {
    setPastedText(samplePastedReportText);
    setSelectedFile({
      name: 'Sample_Pasted_CBC_Report.txt',
      size: '1.2 KB',
      type: 'Text Report Data',
      source: 'text',
    });
  };

  const handleLoadSamplePdf = () => {
    setSelectedFile({
      name: 'Sample_CBC_Metabolic_Report.pdf',
      size: '1.4 MB',
      type: 'PDF Document',
      source: 'sample_pdf',
    });
  };

  const handleAnalyze = () => {
    if (activeTab === 'file' && selectedFile) {
      onStartProcessing(selectedFile);
    } else if (activeTab === 'text' && pastedText.trim()) {
      onStartProcessing({
        name: 'Pasted_Medical_Report.txt',
        size: `${(pastedText.length / 1024).toFixed(1)} KB`,
        type: 'Text Medical Data',
        rawText: pastedText,
        source: 'text',
      });
    }
  };

  const isReady =
    (activeTab === 'file' && selectedFile) ||
    (activeTab === 'text' && pastedText.trim().length > 15);

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 pb-10">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Upload Medical Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Upload your PDF, photo/scan of lab report, or paste text to generate easy explanations.
        </p>
      </div>

      {/* Upload Box Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-7 shadow-soft space-y-5 transition-colors">
        {/* Method Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl max-w-xs">
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'file'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            PDF / Image
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Paste Text
          </button>
        </div>

        {/* Validation / Error Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/90 dark:border-rose-900 flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">Upload Error</h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 text-rose-400 hover:text-rose-700 dark:hover:text-rose-200 rounded-lg transition-colors cursor-pointer"
              title="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'file' ? (
          /* PDF / Image Area */
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !selectedFile && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/30'
                  : selectedFile
                  ? 'border-blue-300 dark:border-blue-700 bg-blue-50/20 dark:bg-blue-950/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                  selectedFile
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800'
                }`}
              >
                {selectedFile ? (
                  <FileCheck className="w-6 h-6" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                {selectedFile ? selectedFile.name : 'Tap to Upload or Drag & Drop'}
              </h3>

              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                Supports PDF reports, PNG, or JPG lab photos (max 25 MB)
              </p>

              {!selectedFile && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-soft cursor-pointer"
                  >
                    Select File
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Paste Report Text Area */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <ClipboardPaste className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Paste Report Text</span>
              </label>

              <button
                type="button"
                onClick={handleLoadSampleText}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Load Sample Text
              </button>
            </div>

            <textarea
              rows={7}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste test names, numbers, and reference ranges here...&#10;Example:&#10;Hemoglobin: 10 g/dL (Reference: 13-17 g/dL)&#10;Glucose: 95 mg/dL (Reference: 70-100 mg/dL)"
              className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-mono leading-relaxed placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500"
            />
          </div>
        )}

        {/* Selected File Box & Remove Action */}
        {selectedFile && (
          <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                  {selectedFile.name}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {selectedFile.size} • Ready to analyze
                </div>
              </div>
            </div>

            <button
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Sample Action Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={handleLoadSamplePdf}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 py-2 px-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try with Sample Report (CBC Demo)</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={!isReady}
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all ${
              isReady
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <span>Analyze Report</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <Disclaimer />
    </div>
  );
}
