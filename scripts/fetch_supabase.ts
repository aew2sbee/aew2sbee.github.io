import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const get25HoursAgoISO = (): string => {
  const now = new Date();
  const hoursAgo25 = new Date(now.getTime() - 25 * 60 * 60 * 1000);
  return hoursAgo25.toISOString();
};


const getJapanDateYYYYMMDD = (): string => {
  const now = new Date();
  const japanTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const yyyy = japanTime.getFullYear();
  const mm = String(japanTime.getMonth() + 1).padStart(2, '0');
  const dd = String(japanTime.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

const fetchAndSaveStudyData = async () => {
  const timestamp25HoursAgo = get25HoursAgoISO ();
  console.log('Fetching data since:', timestamp25HoursAgo);

  // studyデータ取得
  const { data: studies, error: studyError } = await supabase
    .from('study')
    .select('*')
    .lt('timestamp', timestamp25HoursAgo);

  if (studyError) {
    console.error('Error fetching study data:', studyError);
    process.exit(1);
  }
  // studies が空の場合は処理を終了
  if (!studies || studies.length === 0) {
    console.log('No study data found. Exiting.');
    process.exit(0);
  }
  console.log('studies:', studies);
  // userIdを集める
  const userIds = Array.from(new Set(studies.map(s => s.user_id)));
  console.log('userIds:', userIds);
  // usersデータ取得
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .in('id', userIds);

  if (userError) {
    console.error('Error fetching users data:', userError);
    process.exit(1);
  }

  console.log('users:', users);
  // study に user 情報をマージして希望の形式に変換
  const outputData = studies.map(s => {
    const user = users.find(u => u.id === s.user_id);
    return {
      channelId: user.channel_id,
      name: user.name,
      timeSec: s.time_sec
    };
  });

  const finalOutput = { data: outputData };

  // ディレクトリ作成
  const dir = 'data';
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  // ファイル保存
  const filePath = `${dir}/${getJapanDateYYYYMMDD()}.json`;
  writeFileSync(filePath, JSON.stringify(finalOutput, null, 2));

  console.log(`Saved ${outputData.length} records to ${filePath}`);
};

fetchAndSaveStudyData();
