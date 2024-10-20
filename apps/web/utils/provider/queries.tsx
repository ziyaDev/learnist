'use client'
import {
   QueryClient,
   QueryClientProvider,
} from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

export const tanstackQueryClient = new QueryClient()

export default function QueriesProvider({ children }: PropsWithChildren) {
   return (
      <QueryClientProvider client={tanstackQueryClient}>
         {children}
      </QueryClientProvider>
   )
}