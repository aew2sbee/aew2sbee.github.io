import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import { fetchAllGroupedByDate } from '@/db/study';

// 定数定義
const OUTPUT_DIR = 'data';

// 型定義
interface Study {
  user_id: string;
  time_sec: number;
  timestamp: string;
}

interface User {
  id: string;
  channel_id: string;
  name: string;
}

interface OutputRecord {
  channelId: string;
  name: string;
  timeSec: number;
}

interface OutputData {
  data: OutputRecord[];
}

/**
 * 環境変数を検証して取得
 */
const getEnvVariables = (): { url: string; key: string } => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return { url, key };
};

const { url: SUPABASE_URL, key: SUPABASE_KEY } = getEnvVariables();
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * 日付ごとにグループ化された学習データを取得
 */
const fetchGroupedStudyData = async (): Promise<Record<string, Study[]>> => {
  const { data: groupedStudies, error: studyError } = await fetchAllGroupedByDate();

  if (studyError) {
    throw new Error(`Failed to fetch study data: ${studyError.message}`);
  }

  if (!groupedStudies || Object.keys(groupedStudies).length === 0) {
    console.log('No study data found. Exiting.');
    process.exit(0);
  }

  return groupedStudies;
};

/**
 * ユーザーデータを取得
 */
const fetchUserData = async (userIds: string[]): Promise<User[]> => {
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('*')
    .in('id', userIds);

  if (userError) {
    throw new Error(`Failed to fetch users data: ${userError.message}`);
  }

  if (!users || users.length === 0) {
    throw new Error('No users data found');
  }

  return users;
};

/**
 * 学習データとユーザーデータをマージ
 */
const mergeStudyAndUserData = (studies: Study[], users: User[]): OutputRecord[] => {
  return studies.map(study => {
    const user = users.find(u => u.id === study.user_id);
    if (!user) {
      throw new Error(`User not found for study with user_id: ${study.user_id}`);
    }
    return {
      channelId: user.channel_id,
      name: user.name,
      timeSec: study.time_sec
    };
  });
};

/**
 * データをファイルに保存
 */
const saveDataToFile = (data: OutputData, dateString: string): void => {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const filePath = `${OUTPUT_DIR}/${dateString}.json`;
  writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log(`Saved ${data.data.length} records to ${filePath}`);
};

/**
 * メイン処理
 */
const main = async (): Promise<void> => {
  try {
    console.log('Fetching all study data grouped by date...');

    // 日付ごとにグループ化された学習データ取得
    const groupedStudies = await fetchGroupedStudyData();
    console.log('Grouped studies by date:', Object.keys(groupedStudies));

    // 全ユーザーIDを収集
    const allUserIds = Array.from(
      new Set(
        Object.values(groupedStudies)
          .flat()
          .map(s => s.user_id)
      )
    );
    console.log('Total unique user IDs:', allUserIds.length);

    // ユーザーデータを一度だけ取得
    const users = await fetchUserData(allUserIds);
    console.log('Users fetched:', users.length);

    // 各日付ごとにファイルを保存
    for (const [dateString, studies] of Object.entries(groupedStudies)) {
      console.log(`\nProcessing date: ${dateString} (${studies.length} records)`);

      // データマージ
      const outputData = mergeStudyAndUserData(studies, users);
      const finalOutput: OutputData = { data: outputData };

      // ファイル保存
      saveDataToFile(finalOutput, dateString);
    }

    console.log('\nAll files saved successfully!');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

main();
