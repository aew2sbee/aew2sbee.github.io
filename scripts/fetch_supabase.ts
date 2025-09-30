// scripts/fetchStudyData.ts
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Service Role Key 推奨

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const getJapanTime25HoursAgoISO = (): string => {
  const now = new Date();

  // 日本時間 = UTC+9
  const utcTime = now.getTime(); // UTCミリ秒
  const japanTime = new Date(utcTime + 9 * 60 * 60 * 1000); // UTC+9
  japanTime.setHours(japanTime.getHours() - 25); // 25時間前

  // ISO文字列に変換（UTCに戻してSupabaseに送信）
  return new Date(japanTime.getTime() - 9 * 60 * 60 * 1000).toISOString();
};
// 日本時間のYYYYMMDDを返すアロー関数
const getJapanDateYYYYMMDD = (): string => {
  const now = new Date();
  const japanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  const yyyy = japanTime.getFullYear();
  const mm = String(japanTime.getMonth() + 1).padStart(2, '0');
  const dd = String(japanTime.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

async function fetchAndSaveStudyData() {
  const timestamp25HoursAgo = getJapanTime25HoursAgoISO();
  console.log('Fetching data since:', timestamp25HoursAgo);

  // studyデータ取得 + user情報を結合
  const { data, error } = await supabase
    .from('study')
    .select(`
      id,
      userId,
      timeSec,
      timestamp,
      users (
        id,
        channel_id,
        name
      )
    `)
    .lt('timestamp', timestamp25HoursAgo);

  if (error) {
    console.error('Error fetching data:', error);
    process.exit(1);
  }

  const dir = 'data';
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const fileName = getJapanDateYYYYMMDD() + '.json';
  const filePath = `${dir}/${fileName}`;

  writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Saved ${data?.length || 0} records to ${filePath}`);
}

fetchAndSaveStudyData();
