'use client'
import cx from 'clsx';
import { useState } from 'react';
import { Table, Checkbox, ScrollArea, Group, Avatar, Text, rem, Card, Pagination, Flex, Divider, TextInput, Button, Select, PaginationProps } from '@mantine/core';
import classes from './style.module.css';
import { IconFilter, IconSearch, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { spec } from 'node:test/reporters';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/supabase/lib/client';
import { columns } from './columns';
import useSupabase from '@/supabase/lib/use-supabase';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { Tables } from "@/supabase/database.types"
import { useSession } from '@/supabase/lib/use-auth';
import { usePagination } from '@mantine/hooks';
import { useDebounceValue } from 'usehooks-ts';



export function LevelsTable() {
   const [selection, setSelection] = useState<Tables<'levels'>[]>([]);
   const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Tables<'levels'>>>({
      columnAccessor: "created_at",
      direction: 'asc',
   });
   const [pagination, setPagination] = useState<{ page: number, pageSize: number }>({ page: 0, pageSize: 10 })
   const [search, setSearch] = useState('')
   const [debouncedSearchValue] = useDebounceValue(search, 500)
   const supabase = useSupabase()
   const { school } = useSession()
   const { data, isLoading } = useQuery({
      queryKey: ['levels',
         school?.id,
         pagination.page,
         debouncedSearchValue,
         sortStatus
      ],
      queryFn: async () => {
         const start = pagination.page * pagination.pageSize;
         const end = start + pagination.pageSize - 1;
         return supabase.from('levels')
            .select('*', { count: 'exact' })
            .eq('school_id', school.id || "")
            .ilike('name', `%${debouncedSearchValue}%`)
            .order(sortStatus.columnAccessor, { ascending: sortStatus.direction === "asc" })
            .range(start, end)
            .then(res => res)
      },
   })
   const totalPages = data?.count ? Math.ceil(data.count / pagination.pageSize) : 0;


   return (
      <Card withBorder radius="md" p="md" className={classes.card} >
         <ScrollArea>
            <Flex align={'center'} w='100%' pb={'sm'}>
               <TextInput
                  w={'100%'}
                  placeholder="Search by full name"
                  leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </Flex>
            <DataTable

               fetching={isLoading}
               verticalSpacing="sm"
               selectedRecords={selection}
               onSelectedRecordsChange={setSelection}
               minHeight={300}
               records={data?.data || []}
               columns={columns}
               striped
               sortStatus={sortStatus}
               onSortStatusChange={setSortStatus}
               highlightOnHover
               loaderColor="orange"
               loaderBackgroundBlur={1}
            />
         </ScrollArea>
         <Card.Section withBorder inheritPadding mt={'sm'} py="md">
            <Group justify="space-between" align={'center'} w='100%' >
               <Text size='sm' c='dimmed'>
                  {data ? `Showing ${data?.data?.length || 0} of ${data.count} results` : 'Loading...'}
               </Text>
               <Pagination
                  total={totalPages}
                  value={pagination.page + 1}
                  onChange={(value) => setPagination({
                     page: value - 1,
                     pageSize: pagination.pageSize
                  })} color="orange" size="sm" />
            </Group>
         </Card.Section>
      </Card>
   );
}