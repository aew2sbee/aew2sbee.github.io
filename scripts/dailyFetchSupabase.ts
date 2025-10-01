import { fetchDaily } from '@/db/study';
import { fetchByUserIds } from '@/db/user';
import { writeFileSync, mkdirSync, existsSync } from 'fs';


const main = async () => {

  // studyデータ取得
  const { data: studies, error: studyError } = await fetchDaily();

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

  // usersデータ取得
  const userIds = Array.from(new Set(studies.map(s => s.user_id)));
  console.log('userIds:', userIds);
  const { data: users, error: userError } = await fetchByUserIds(userIds);

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
