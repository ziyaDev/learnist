'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import useSupabase from '@/supabase/lib/use-supabase';

export const useSession = () => {
  const supabase = useSupabase();
  const { school } = useParams<{ school: string }>();
  const { data, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => supabase.auth.getUser(),
    retry: 1,
  });
  return {
    user: data?.data.user,
    school: {
      id: school,
    },
  };
};
