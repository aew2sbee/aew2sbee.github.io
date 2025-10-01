import { supabase } from "./supabase";

export const fetchByUserIds = async (userIds: number[]) => await supabase.from('users').select('*').in('id', userIds);