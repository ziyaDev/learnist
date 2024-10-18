import { NextRequest } from 'next/server';
import { User } from '@supabase/auth-js';
import { createServerClient } from '@/supabase/lib/server';

const getDefaultSchool = async (user: User) => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('schools')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .single();
  if (!data || error) {
    return null;
  }
  return data.id;
};
const isValidSchoolId = async (school: string, user: User) => {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('schools')
    .select('id')
    .eq('user_id', user.id)
    .eq('id', school)
    .single();
  return data?.id;
};

export { getDefaultSchool, isValidSchoolId };
