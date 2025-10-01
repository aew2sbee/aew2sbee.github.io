import { supabase } from "./supabase";

interface Study {
  user_id: string;
  time_sec: number;
  timestamp: string;
}

export const fetchAll = async () => await supabase.from('study').select('*');

export const fetchAllGroupedByDate = async () => {
  const { data, error } = await supabase.from('study').select('*');

  if (error || !data) {
    return { data: null, error };
  }

  // YYYYMMDDごとにグループ化
  const grouped = data.reduce((acc: Record<string, Study[]>, study: Study) => {
    const dateKey = study.timestamp.slice(0, 10).replace(/-/g, '');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(study);
    return acc;
  }, {});

  return { data: grouped, error: null };
};

export const fetchDaily = async () => await supabase.from('study').select('*').gte('timestamp', get25HoursAgoISO());;

const get25HoursAgoISO = (): string => {
  const now = new Date();
  const hoursAgo25 = new Date(now.getTime() - 25 * 60 * 60 * 1000);
  return hoursAgo25.toISOString();
};