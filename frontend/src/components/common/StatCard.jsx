import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-600 bg-blue-50 border-blue-100',
  trend,
  trendType = 'neutral',
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-soft hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {value}
            </span>
            {trend && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  trendType === 'positive'
                    ? 'bg-emerald-50 text-emerald-700'
                    : trendType === 'negative'
                    ? 'bg-amber-50 text-amber-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 pt-0.5">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${iconColor}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
