import { supabase } from "./supabase";


export const fetchAll = async () => await supabase.from('study').select('*');
export const fetchDaily = async () => await supabase.from('study').select('*').gte('timestamp', get25HoursAgoISO());;

const get25HoursAgoISO = (): string => {
  const now = new Date();
  const hoursAgo25 = new Date(now.getTime() - 25 * 60 * 60 * 1000);
  return hoursAgo25.toISOString();
};