'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import useSupabase from '@/supabase/lib/use-supabase';

export const useSession = () => {
  const supabase = useSupabase();
  const params = useParams<{ school: string }>();
  const user = useQuery({
    queryKey: ['user'],
    queryFn: async () => await supabase.auth.getUser().then(({ data }) => data),
    retry: 1,
  });
  const school = useQuery({
    queryKey: ['school'],
    queryFn: async () =>
      await supabase
        .from('schools')
        .select('*')
        .eq('id', params.school)
        .single()
        .then(({ data }) => data),
    retry: 1,
  });
  return {
    loading: user.isLoading || school.isLoading,
    user: user?.data?.user,
    school: {
      id: params.school,
      ...school?.data,
    },
  };
};
