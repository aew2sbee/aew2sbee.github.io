import { supabase } from '@/db/supabase';
import { writeFileSync, mkdirSync, existsSync } from 'fs';

const main = async () => {
  // 昨日の日付範囲を計算
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const yesterdayEnd = new Date(yesterday);
  yesterdayEnd.setHours(23, 59, 59, 999);

  const startTime = yesterday.toISOString();
  const endTime = yesterdayEnd.toISOString();

  console.log('Fetching data for yesterday:', startTime, 'to', endTime);

  // studyデータ取得
  const { data: studies, error: studyError } = await supabase
    .from('study')
    .select('*')
    .gte('timestamp', startTime)
    .lte('timestamp', endTime);

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
  const yyyymmdd = studies[0].timestamp.slice(0,10).replace(/-/g,'');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  // ファイル保存
  const filePath = `${dir}/${yyyymmdd}.json`;
  writeFileSync(filePath, JSON.stringify(finalOutput, null, 2));

  console.log(`Saved ${outputData.length} records to ${filePath}`);
};

main();