'use client';

import { useMemo } from 'react';
import { createClient } from './client';

function useSupabase() {
  return useMemo(createClient, []);
}

export default useSupabase;
