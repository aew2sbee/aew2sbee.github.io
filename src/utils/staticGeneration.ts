/**
 * @fileoverview Next.js静的サイト生成用のユーティリティ関数
 * チャンネル別ページの静的生成に必要なパスとプロップスを提供する
 */

import fs from 'fs';
import path from 'path';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getLast7Days, getLast30Days } from './dateUtils';

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
 * 1日分のデータファイルの型定義
 */
interface DayData {
  /** その日の全学習データの配列 */
  data: StudyData[];
}

/**
 * チャンネルページのプロップス型定義
 */
interface ChannelPageProps {
  /** チャンネルID */
  channelId: string;
  /** 日付をキーとする学習データのマップ */
  allData: { [date: string]: StudyData | null };
  /** 総学習時間（秒） */
  totalTime: number;
  /** チャンネル名 */
  channelName: string;
  /** 最終更新日（YYYYMMDD形式） */
  lastUpdateDate: string;
  /** 過去7日間の合計時間（秒） */
  last7DaysTime: number;
  /** 過去30日間の合計時間（秒） */
  last30DaysTime: number;
}

/**
 * 静的サイト生成用のパス生成関数
 * dataディレクトリ内のJSONファイルから全てのチャンネルIDを抽出し、
 * 動的ルーティング用のパスを生成する
 *
 * @returns 静的生成するパスの配列とfallbackオプション
 * @example
 * // 以下のようなパスが生成される:
 * // [
 * //   { params: { channelId: 'UC123...' } },
 * //   { params: { channelId: 'UC456...' } }
 * // ]
 */
export const getStaticPaths: GetStaticPaths = async () => {
  const dataDir = path.join(process.cwd(), 'data');
  const channelIds = new Set<string>();

  try {
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
    console.log(`Found ${files.length} JSON files in data directory`);

    // 全JSONファイルからチャンネルIDを抽出
    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const dayData: DayData = JSON.parse(fileContent);

      dayData.data.forEach(item => {
        if (item.channelId) {
          channelIds.add(item.channelId);
        }
      });
    }

    console.log(`Extracted ${channelIds.size} unique channel IDs`);
  } catch (error) {
    console.error('Error reading data files:', error);
    throw error; // エラーを上に投げてビルドを失敗させる
  }

  const paths = Array.from(channelIds).map(channelId => ({
    params: { channelId }
  }));

  if (paths.length === 0) {
    throw new Error('No channel IDs found in data files');
  }

  return {
    paths,
    fallback: false // 事前定義されたパス以外は404を返す
  };
};

/**
 * 静的サイト生成用のプロップス取得関数
 * 指定されたチャンネルIDに対する学習データを集計し、ページに必要なデータを準備する
 *
 * @param context - Next.jsのGetStaticPropsContext（パラメータを含む）
 * @returns チャンネルページに渡すプロップス
 * @example
 * // contextから取得される情報:
 * // context.params.channelId = 'UC123...'
 * //
 * // 返される値:
 * // {
 * //   props: {
 * //     channelId: 'UC123...',
 * //     allData: { '20231225': { channelId: '...', name: '...', timeSec: 3600 } },
 * //     totalTime: 36000,
 * //     channelName: 'サンプルチャンネル',
 * //     lastUpdateDate: '20231225'
 * //   }
 * // }
 */
export const getStaticProps: GetStaticProps<ChannelPageProps> = async (context) => {
  const { channelId } = context.params!;
  const channelIdStr = channelId as string;

  const dataDir = path.join(process.cwd(), 'data');

  try {
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
    const allData: { [date: string]: StudyData | null } = {};
    let totalTime = 0;
    let channelName = '';

    // 最新のファイル名（日付）を取得（降順ソート）
    const sortedFiles = files.sort((a, b) => b.replace('.json', '').localeCompare(a.replace('.json', '')));
    const lastUpdateDate = sortedFiles.length > 0 ? sortedFiles[0].replace('.json', '') : '';

    // 全ファイルを処理してチャンネル別データを集計
    for (const file of files) {
      const date = file.replace('.json', '');
      const filePath = path.join(dataDir, file);

      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const dayData: DayData = JSON.parse(fileContent);

        // 指定されたchannelIdでfindで探す
        const userData = dayData.data.find(item => item.channelId === channelIdStr);

        if (userData) {
          allData[date] = {
            channelId: channelIdStr,
            name: userData.name,
            timeSec: userData.timeSec
          };

          totalTime += userData.timeSec;
          // 初回のみチャンネル名を設定
          if (!channelName) {
            channelName = userData.name;
          }
        } else {
          // データが存在しない日はnullを設定
          allData[date] = null;
        }
      } catch (fileError) {
        console.error(`Error reading file ${file}:`, fileError);
        allData[date] = null;
      }
    }

    // 過去7日間の合計時間を計算
    const last7DaysData = getLast7Days(0, allData);
    const last7DaysTime = last7DaysData.reduce((sum, item) => {
      return sum + (item.data?.timeSec || 0);
    }, 0);

    // 過去30日間の合計時間を計算
    const last30DaysData = getLast30Days(0, allData);
    const last30DaysTime = last30DaysData.reduce((sum, item) => {
      return sum + (item.data?.timeSec || 0);
    }, 0);

    return {
      props: {
        channelId: channelIdStr,
        allData,
        totalTime,
        channelName: channelName || 'Unknown Channel',
        lastUpdateDate,
        last7DaysTime,
        last30DaysTime
      }
    };
  } catch (error) {
    console.error('Error reading data directory:', error);
    // エラー時はデフォルト値を返す
    return {
      props: {
        channelId: channelIdStr,
        allData: {},
        totalTime: 0,
        channelName: 'Unknown Channel',
        lastUpdateDate: '',
        last7DaysTime: 0,
        last30DaysTime: 0
      }
    };
  }
};