import React from 'react';

interface StudyData {
  channelId: string;
  name: string;
  timeSec: number;
}

interface ChartDataPoint {
  date: string;
  data: StudyData | null;
}

interface StatsSummaryProps {
  data: ChartDataPoint[];
  periodLabel: string; // "7日平均" or "30日平均"
  formatTime: (seconds: number) => React.ReactElement;
}

export default function StatsSummary({ data, periodLabel, formatTime }: StatsSummaryProps) {
  const validDays = data.filter(day => day.data !== null);
  const studyDays = validDays.length;

  const averageTime = validDays.length === 0
    ? <span>0<span className="text-sm">分</span></span>
    : formatTime(validDays.reduce((sum, day) => sum + day.data!.timeSec, 0) / validDays.length);

  const maxTime = validDays.length === 0
    ? <span>0<span className="text-sm">分</span></span>
    : formatTime(Math.max(...validDays.map(day => day.data!.timeSec)));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
        <p className="text-sm font-medium text-blue-600">集中日数</p>
        <p className="text-2xl font-bold text-blue-900">
          {studyDays}日
        </p>
      </div>
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
        <p className="text-sm font-medium text-green-600">{periodLabel}</p>
        <p className="text-2xl font-bold text-green-900">
          {averageTime}
        </p>
      </div>
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100">
        <p className="text-sm font-medium text-purple-600">最高記録</p>
        <p className="text-2xl font-bold text-purple-900">
          {maxTime}
        </p>
      </div>
    </div>
  );
}