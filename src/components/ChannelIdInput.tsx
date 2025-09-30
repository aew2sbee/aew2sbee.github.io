import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ChannelIdInput() {
  const [channelId, setChannelId] = useState('');
  const router = useRouter();

  const handleNavigate = () => {
    if (channelId.trim()) {
      router.push(`/${channelId.trim()}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNavigate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          チャンネルIDを入力
        </h3>
      </div>

      <div className="p-6">
        <div className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="例: UCDV95uUZlqOmxJ0hONnoALw"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            />
            <button
              onClick={handleNavigate}
              disabled={!channelId.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              データを見る
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            チャンネルIDはYouTubeチャンネルのURLから確認できます
          </p>
        </div>
      </div>
    </div>
  );
}