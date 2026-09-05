import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  X,
  FileCheck,
  ArrowRight,
  ClipboardPaste,
  AlertCircle,
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
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Upload Medical Report
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Upload your PDF, scanned image, or paste test text to generate simple AI explanations.
        </p>
      </div>

      {/* Upload Box Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
        {/* Method Toggle */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl max-w-sm">
          <button
            onClick={() => setActiveTab('file')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'file'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            PDF / Image
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'text'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paste Text
          </button>
        </div>

        {/* Validation / Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/90 flex items-start gap-3 text-left">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-rose-900">Upload Validation Error</h4>
              <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 text-rose-400 hover:text-rose-700 rounded-lg transition-colors"
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
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-50/40'
                  : selectedFile
                  ? 'border-blue-300 bg-blue-50/20'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all ${
                  selectedFile
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                }`}
              >
                {selectedFile ? (
                  <FileCheck className="w-6 h-6" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                {selectedFile ? selectedFile.name : 'Drag & Drop PDF / Image'}
              </h3>

              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Supports standard laboratory PDF reports, PNG, or JPG lab scans
              </p>

              {!selectedFile && (
                <div className="mt-4">
                  <span className="text-xs font-semibold text-slate-400 block mb-2">OR</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-soft"
                  >
                    Browse Files
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Paste Report Text Area */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ClipboardPaste className="w-3.5 h-3.5 text-blue-600" />
                <span>Paste Report Text</span>
              </label>

              <button
                type="button"
                onClick={handleLoadSampleText}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                Load Sample Text
              </button>
            </div>

            <textarea
              rows={7}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste test names, numbers, and reference ranges here...
Example:
Hemoglobin: 10 g/dL (Reference: 13-17 g/dL)
Glucose: 95 mg/dL (Reference: 70-100 mg/dL)"
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-800 font-mono leading-relaxed placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            />
          </div>
        )}

        {/* Selected File Box & Remove/Change Action */}
        {selectedFile && (
          <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {selectedFile.name}
                </div>
                <div className="text-[11px] text-slate-500">
                  {selectedFile.size} • Ready to analyze
                </div>
              </div>
            </div>

            <button
              onClick={handleClear}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Sample Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleLoadSamplePdf}
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 self-start sm:self-auto"
          >
            + Try with sample medical PDF
          </button>

          <button
            onClick={handleAnalyze}
            disabled={!isReady}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all ${
              isReady
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
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
