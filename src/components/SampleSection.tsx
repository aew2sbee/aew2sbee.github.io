import Link from 'next/link';

export default function SampleSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">サンプル</h3>
        <p className="text-sm text-gray-600">
          小倉あんのアナリティクスデータを確認できます
        </p>
      </div>

      <div className="p-6">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <div className="mb-4">
            <Link
              href="/UCDV95uUZlqOmxJ0hONnoALw"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2 2z"
                />
              </svg>
              サンプルデータを見る
            </Link>
          </div>
          <p className="text-xs text-gray-500">
            Channel ID: UCDV95uUZlqOmxJ0hONnoALw
          </p>
        </div>
      </div>
    </div>
  );
}