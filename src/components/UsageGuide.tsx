import Image from 'next/image';

export default function UsageGuide() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          チャンネルIDの調べ方(PC版のみ)
        </h3>
      </div>

      <div className="p-6">
        {/* PC版のみの注意喚起 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-yellow-800 mb-1">重要：PC版でのみ利用可能</h4>
              <p className="text-sm text-yellow-700">
                この方法はPCのブラウザー（Chrome、Firefox、Safari等）からYouTubeにアクセスした場合のみ利用できます。<br/>
                <strong>スマートフォン・タブレットのYouTubeアプリでは「チャンネルIDをコピー」が存在しません。</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* ステップ1 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                自分のマイページにアクセス
              </h4>
              <p className="text-gray-600 mb-3">
                「...さらに表示」をクリックする
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Image
                  src="/step_1.png"
                  alt="チャンネルIDの見つけ方 - ステップ1"
                  width={800}
                  height={400}
                  className="w-full rounded border"
                />
              </div>
            </div>
          </div>

          {/* ステップ2 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                チャンネルIDをコピー
              </h4>
              <p className="text-gray-600 mb-3">
                「チャンネルを共有」をクリックして、「チャンネルIDをコピー」を選択してください。
              </p>
              <Image
                src="/step_2.png"
                alt="データの確認方法 - ステップ2"
                width={800}
                height={400}
                className="w-full rounded border"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}