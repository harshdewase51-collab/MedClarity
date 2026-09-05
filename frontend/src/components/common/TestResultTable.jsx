import React from 'react';
import StatusBadge from './StatusBadge';

export default function TestResultTable({ tests = [] }) {
  if (!tests || tests.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400">
        No individual biomarkers listed in this report.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-2xl">
      <table className="w-full text-left text-xs sm:text-sm">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px] tracking-wider">
          <tr>
            <th className="py-3 px-4 sm:px-6">Test</th>
            <th className="py-3 px-4">Result</th>
            <th className="py-3 px-4">Reference Range</th>
            <th className="py-3 px-4 text-right sm:text-left">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-medium">
          {tests.map((test) => (
            <tr
              key={test.id}
              className="hover:bg-slate-50/60 transition-colors"
            >
              <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900">
                {test.name || test.testName}
              </td>
              <td className="py-3.5 px-4 font-extrabold text-slate-900 whitespace-nowrap">
                {test.value}{' '}
                <span className="text-xs font-normal text-slate-500">
                  {test.unit}
                </span>
              </td>
              <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                {test.referenceRange || 'Not Specified'}
              </td>
              <td className="py-3.5 px-4 text-right sm:text-left whitespace-nowrap">
                <StatusBadge status={test.status} size="sm" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
