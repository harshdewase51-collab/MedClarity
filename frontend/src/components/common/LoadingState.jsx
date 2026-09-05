import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({
  message = 'Loading medical report data...',
  description = 'Please wait while we prepare your information.',
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-soft flex flex-col items-center justify-center space-y-3 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>

      <div className="space-y-1">
        <h4 className="text-sm sm:text-base font-bold text-slate-800">
          {message}
        </h4>
        <p className="text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}
