'use client';

import { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const tanstackQueryClient = new QueryClient();

export default function QueriesProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={tanstackQueryClient}>{children}</QueryClientProvider>;
}
