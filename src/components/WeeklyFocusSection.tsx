import React from 'react';
import StatsSummary from './StatsSummary';
import BarChart from './BarChart';

interface StudyData {
  channelId: string;
  name: string;
  timeSec: number;
}

interface ChartDataPoint {
  date: string;
  data: StudyData | null;
}

interface WeeklyFocusSectionProps {
  weekOffset: number;
  setWeekOffset: (offset: number) => void;
  getLast7Days: (offset: number) => ChartDataPoint[];
  formatTime: (seconds: number) => React.ReactElement;
  formatDateShort: (dateStr: string) => string;
  getDayOfWeek: (dateStr: string) => string;
}

export default function WeeklyFocusSection({
  weekOffset,
  setWeekOffset,
  getLast7Days,
  formatTime,
  formatDateShort,
  getDayOfWeek
}: WeeklyFocusSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">過去7日間の集中時間</h3>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 rounded-lg shadow-sm transition-colors"
              title="前の週"
            >
              ← 前週
            </button>
            <span className="text-xs sm:text-sm text-gray-800 font-medium px-1 sm:px-2">
              {weekOffset === 0 ? '今週' : `${weekOffset}週前`}
            </span>
            <button
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
              disabled={weekOffset === 0}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 disabled:bg-gray-300 disabled:text-gray-500 rounded-lg shadow-sm transition-colors"
              title="次の週"
            >
              次週 →
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <StatsSummary
          data={getLast7Days(weekOffset)}
          periodLabel="7日平均"
          formatTime={formatTime}
        />

        <BarChart
          data={getLast7Days(weekOffset)}
          formatDateShort={formatDateShort}
          getDayOfWeek={getDayOfWeek}
        />
      </div>
    </div>
  );
}