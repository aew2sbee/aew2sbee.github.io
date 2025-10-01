import { supabase } from './supabase';

interface Study {
  id: number;
  user_id: number;
  time_sec: number;
  timestamp: string;
}

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
