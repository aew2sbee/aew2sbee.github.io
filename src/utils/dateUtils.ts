/**
 * 学習データの型定義
 */
interface StudyData {
  /** チャンネルID */
  channelId: string;
  /** チャンネル名 */
  name: string;
  /** 学習時間（秒） */
  timeSec: number;
}

/**
 * チャートデータポイントの型定義
 */
interface ChartDataPoint {
  /** YYYYMMDD形式の日付文字列 */
  date: string;
  /** その日の学習データ（データがない場合はnull） */
  data: StudyData | null;
}

/**
 * YYYYMMDD形式の日付文字列をYYYY/MM/DD形式にフォーマットする
 * @param dateStr - YYYYMMDD形式の日付文字列
 * @returns YYYY/MM/DD形式の日付文字列
 * @example
 * formatDate('20231225') // '2023/12/25'
 */
export const formatDate = (dateStr: string) => {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${year}/${month}/${day}`;
};

/**
 * YYYYMMDD形式の日付文字列をMM/DD形式にフォーマットする
 * @param dateStr - YYYYMMDD形式の日付文字列
 * @returns MM/DD形式の日付文字列
 * @example
 * formatDateShort('20231225') // '12/25'
 */
export const formatDateShort = (dateStr: string) => {
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${month}/${day}`;
};

/**
 * YYYYMMDD形式の日付文字列から曜日を取得する
 * @param dateStr - YYYYMMDD形式の日付文字列
 * @returns 日本語の曜日文字列
 * @example
 * getDayOfWeek('20231225') // '月'
 */
export const getDayOfWeek = (dateStr: string) => {
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));
  const date = new Date(year, month, day);
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  return days[date.getDay()];
};

/**
 * 過去7日間のデータを取得する
 * @param offset - 週のオフセット（0=今週、1=先週、2=先々週...）
 * @param allData - 全ての学習データ（日付をキーとするオブジェクト）
 * @returns 過去7日間のチャートデータポイント配列
 * @example
 * getLast7Days(0, allData) // 今週の7日間のデータ
 * getLast7Days(1, allData) // 先週の7日間のデータ
 */
export const getLast7Days = (offset = 0, allData: { [date: string]: StudyData | null }): ChartDataPoint[] => {
  const result = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i - (offset * 7));
    const dateStr = date.getFullYear().toString() +
                   (date.getMonth() + 1).toString().padStart(2, '0') +
                   date.getDate().toString().padStart(2, '0');

    result.push({
      date: dateStr,
      data: allData[dateStr] || null
    });
  }

  return result;
};

/**
 * 過去30日間のデータを取得する
 * @param offset - 月のオフセット（0=今月、1=先月、2=先々月...）
 * @param allData - 全ての学習データ（日付をキーとするオブジェクト）
 * @returns 過去30日間のチャートデータポイント配列
 * @example
 * getLast30Days(0, allData) // 今月の30日間のデータ
 * getLast30Days(1, allData) // 先月の30日間のデータ
 */
export const getLast30Days = (offset = 0, allData: { [date: string]: StudyData | null }): ChartDataPoint[] => {
  const result = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i - (offset * 30));
    const dateStr = date.getFullYear().toString() +
                   (date.getMonth() + 1).toString().padStart(2, '0') +
                   date.getDate().toString().padStart(2, '0');

    result.push({
      date: dateStr,
      data: allData[dateStr] || null
    });
  }

  return result;
};