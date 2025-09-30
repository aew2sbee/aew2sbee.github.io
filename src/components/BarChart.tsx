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

interface BarChartProps {
  data: ChartDataPoint[];
  formatDateShort: (dateStr: string) => string;
  getDayOfWeek: (dateStr: string) => string;
}

export default function BarChart({ data, formatDateShort, getDayOfWeek }: BarChartProps) {
  const formatTimeForChart = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) {
      return <span>{minutes}<span style={{ fontSize: '8px' }}>分</span></span>;
    } else if (minutes === 0) {
      return <span>{hours}<span style={{ fontSize: '8px' }}>時</span></span>;
    } else {
      return <span>{hours}<span style={{ fontSize: '8px' }}>時</span>{minutes}<span style={{ fontSize: '8px' }}>分</span></span>;
    }
  };

  const validDays = data.filter(day => day.data !== null);
  const maxSeconds = validDays.length > 0 ? Math.max(...validDays.map(day => day.data!.timeSec)) : 1;

  return (
    <div className="bg-gray-50 rounded-lg p-4 pt-8">
      <div className="flex items-end justify-between space-x-1" style={{ height: '200px' }}>
        {data.map((item, index) => {
          const currentSeconds = item.data ? item.data.timeSec : 0;
          const height = (currentSeconds / maxSeconds) * 160;

          return (
            <div key={index} className="flex-1 flex flex-col items-center min-w-0">
              <div className="text-xs text-gray-600 mb-1 text-center" style={{ fontSize: '10px' }}>
                {item.data ? (
                  <span style={{ fontSize: '10px' }}>
                    {formatTimeForChart(item.data.timeSec)}
                  </span>
                ) : (
                  <span style={{ fontSize: '10px' }}>0<span style={{ fontSize: '8px' }}>分</span></span>
                )}
              </div>
              <div
                className="rounded-t w-full"
                style={{
                  height: `${height}px`,
                  minHeight: '4px',
                  backgroundColor: '#41b4d9',
                  maxWidth: '24px'
                }}
              />
              <div className="text-xs text-gray-500 mt-2 text-center" style={{ fontSize: '9px' }}>
                <div>{formatDateShort(item.date)}</div>
                <div>({getDayOfWeek(item.date)})</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}