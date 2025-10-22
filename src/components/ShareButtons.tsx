import html2canvas from 'html2canvas';

interface ShareButtonsProps {
  totalTime: number;
  totalDays: number;
  last7DaysTime: number;
  last30DaysTime: number;
  captureTargetRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ShareButtons({ totalTime, totalDays, last7DaysTime, last30DaysTime, captureTargetRef }: ShareButtonsProps) {
  const formatTimeText = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;
  };

  const getShareText = () => {
    const totalTimeText = formatTimeText(totalTime);
    const last7DaysText = formatTimeText(last7DaysTime);
    const last30DaysText = formatTimeText(last30DaysTime);

    return `集中記録📚\n- 総集中日数: ${totalDays}日\n- 総集中時間: ${totalTimeText}\n- 過去7日間: ${last7DaysText}\n- 過去30日間: ${last30DaysText}\n\n#studywithme\n\nhttps://youtube.com/@aew2sbee?si=Jw2KLKR9OPBCwZyq`;
  };

  const captureScreenshot = async () => {
    if (!captureTargetRef?.current) return null;

    try {
      const element = captureTargetRef.current;

      // キャプチャ前に少し待機してレンダリングを完了させる
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        backgroundColor: '#f3f4f6',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        // スクロールを考慮しない設定
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
      });

      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      return null;
    }
  };

  const downloadImage = async () => {
    const imageUrl = await captureScreenshot();
    if (!imageUrl) return;

    // 現在の日付をYYYYMMDD形式で取得
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}${month}${day}`;

    const link = document.createElement('a');
    link.download = `${dateString}_集中記録.png`;
    link.href = imageUrl;
    link.click();
  };

  const handleTwitterShare = () => {
    const text = getShareText();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">記録を共有</h2>
      <div className="flex gap-3">
        <button
          onClick={downloadImage}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          画像をダウンロード
        </button>
        <button
          onClick={handleTwitterShare}
          className="flex-1 bg-[#000000] hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Twitter
        </button>
      </div>
    </div>
  );
}
