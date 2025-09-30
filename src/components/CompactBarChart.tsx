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

interface CompactBarChartProps {
  data: ChartDataPoint[];
  formatDate: (dateString: string) => string;
  getDayOfWeek: (dateStr: string) => string;
  formatTime: (seconds: number) => React.ReactElement;
}

export default function CompactBarChart({
  data,
  formatDate,
  getDayOfWeek,
  formatTime
}: CompactBarChartProps) {
  const validDays = data.filter(day => day.data !== null);
  const maxSeconds = validDays.length > 0 ? Math.max(...validDays.map(day => day.data!.timeSec)) : 1;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-end justify-between space-x-1" style={{ height: '150px' }}>
        {data.map((item, index) => {
          const currentSeconds = item.data ? item.data.timeSec : 0;
          const height = (currentSeconds / maxSeconds) * 120;

          return (
            <div key={index} className="flex-1 flex flex-col items-center group relative">
              {/* ツールチップ */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                <div>{formatDate(item.date)} ({getDayOfWeek(item.date)})</div>
                <div>{item.data ? formatTime(item.data.timeSec) : '記録なし'}</div>
              </div>
              <div
                className="rounded-t w-full hover:opacity-80 transition-opacity"
                style={{
                  height: `${height}px`,
                  minHeight: '2px',
                  backgroundColor: '#41b4d9'
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{formatDate(data[0].date)}</span>
        <span>{formatDate(data[data.length - 1].date)}</span>
      </div>
    </div>
  );
}