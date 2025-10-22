import { useState, useRef } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import StatsCards from '../components/StatsCards';
import ShareButtons from '../components/ShareButtons';
import MonthlyFocusSection from '../components/MonthlyFocusSection';
import WeeklyFocusSection from '../components/WeeklyFocusSection';
import { formatDate, formatDateShort, getDayOfWeek, getLast7Days, getLast30Days } from '../utils/dateUtils';
import { formatTime } from '../components/timeUtils';
export { getStaticPaths, getStaticProps } from '../utils/staticGeneration';

interface StudyData {
  channelId: string;
  name: string;
  timeSec: number;
}

interface ChannelPageProps {
  channelId: string;
  allData: { [date: string]: StudyData | null };
  totalTime: number;
  channelName: string;
  lastUpdateDate: string;
}

export default function ChannelPage({ allData, totalTime, channelName, lastUpdateDate }: ChannelPageProps) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);
  const captureTargetRef = useRef<HTMLDivElement>(null);

  // 過去7日間の合計時間を計算
  const last7DaysData = getLast7Days(0, allData);
  const last7DaysTime = last7DaysData.reduce((sum, item) => {
    return sum + (item.data?.timeSec || 0);
  }, 0);

  // 過去30日間の合計時間を計算
  const last30DaysData = getLast30Days(0, allData);
  const last30DaysTime = last30DaysData.reduce((sum, item) => {
    return sum + (item.data?.timeSec || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="アナリティクス" userName={channelName} />

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <ShareButtons
          totalTime={totalTime}
          totalDays={Object.values(allData).filter(data => data !== null).length}
          last7DaysTime={last7DaysTime}
          last30DaysTime={last30DaysTime}
          captureTargetRef={captureTargetRef}
        />

        <div ref={captureTargetRef}>
          <StatsCards
            totalDays={Object.values(allData).filter(data => data !== null).length}
            totalTime={totalTime}
            averageTime={Object.values(allData).filter(data => data !== null).length > 0
              ? formatTime(totalTime / Object.values(allData).filter(data => data !== null).length)
              : <span>0<span className="text-sm">分</span></span>
            }
            lastUpdateDate={lastUpdateDate}
            formatDate={formatDate}
            formatTime={formatTime}
          />

          <WeeklyFocusSection
            weekOffset={weekOffset}
            setWeekOffset={setWeekOffset}
            getLast7Days={(offset) => getLast7Days(offset, allData)}
            formatTime={formatTime}
            formatDateShort={formatDateShort}
            getDayOfWeek={getDayOfWeek}
          />

          <MonthlyFocusSection
            monthOffset={monthOffset}
            setMonthOffset={setMonthOffset}
            getLast30Days={(offset) => getLast30Days(offset, allData)}
            formatTime={formatTime}
            formatDate={formatDate}
            getDayOfWeek={getDayOfWeek}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

