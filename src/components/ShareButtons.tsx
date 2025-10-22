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

  const handleLineShare = () => {
    const text = getShareText();
    const lineUrl = `https://social-plugins.line.me/lineit/share?text=${encodeURIComponent(text)}`;
    window.open(lineUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">記録を共有</h2>
      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            onClick={handleTwitterShare}
            className="flex-1 bg-[#000000] hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Twitter
          </button>
          <button
            onClick={handleLineShare}
            className="flex-1 bg-[#06C755] hover:bg-[#05b34b] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            LINE
          </button>
        </div>
        <button
          onClick={downloadImage}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          画像をダウンロード
        </button>
      </div>
    </div>
  );
}
