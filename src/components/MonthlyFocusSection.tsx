import React from 'react';
import StatsSummary from './StatsSummary';
import CompactBarChart from './CompactBarChart';

interface StudyData {
  channelId: string;
  name: string;
  timeSec: number;
}

interface ChartDataPoint {
  date: string;
  data: StudyData | null;
}

interface MonthlyFocusSectionProps {
  monthOffset: number;
  setMonthOffset: (offset: number) => void;
  getLast30Days: (offset: number) => ChartDataPoint[];
  formatTime: (seconds: number) => React.ReactElement;
  formatDate: (dateString: string) => string;
  getDayOfWeek: (dateStr: string) => string;
}

export default function MonthlyFocusSection({
  monthOffset,
  setMonthOffset,
  getLast30Days,
  formatTime,
  formatDate,
  getDayOfWeek
}: MonthlyFocusSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">過去30日間の集中時間</h3>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setMonthOffset(monthOffset + 1)}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 rounded-lg shadow-sm transition-colors"
              title="前の月"
            >
              ← 前月
            </button>
            <span className="text-xs sm:text-sm text-gray-800 font-medium px-1 sm:px-2">
              {monthOffset === 0 ? '今月' : `${monthOffset}ヶ月前`}
            </span>
            <button
              onClick={() => setMonthOffset(Math.max(0, monthOffset - 1))}
              disabled={monthOffset === 0}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 disabled:bg-gray-300 disabled:text-gray-500 rounded-lg shadow-sm transition-colors"
              title="次の月"
            >
              次月 →
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <StatsSummary
          data={getLast30Days(monthOffset)}
          periodLabel="30日平均"
          formatTime={formatTime}
        />

        <CompactBarChart
          data={getLast30Days(monthOffset)}
          formatDate={formatDate}
          getDayOfWeek={getDayOfWeek}
          formatTime={formatTime}
        />
      </div>
    </div>
  );
}