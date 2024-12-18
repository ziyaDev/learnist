'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconSearch } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useDebounceValue } from 'usehooks-ts';
import { Card, Flex, Group, Pagination, rem, ScrollArea, Text, TextInput } from '@mantine/core';
import { Tables } from '@/supabase/database.types';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { columns } from './columns';
import classes from './style.module.css';

const AssignedClassesDataTable = ({
  student_id,
  class_id,
}: {
  student_id?: number;
  class_id?: number;
}) => {
  const { school } = useSession();
  const supabase = useSupabase();
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<Tables<'student_class_assignments'>>
  >({
    columnAccessor: 'created_at',
    direction: 'desc',
  });
  const [pagination, setPagination] = useState<{ page: number; pageSize: number }>({
    page: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  const [debouncedSearchValue] = useDebounceValue(search, 500);
  const { isLoading, data } = useQuery({
    queryKey: ['student_class_assignments', student_id, school.id],
    queryFn: async () => {
      const start = pagination.page * pagination.pageSize;
      const end = start + pagination.pageSize - 1;
      const query = supabase
        .from('student_class_assignments')
        .select('*, students(*),classes(*,levels(*))', { count: 'exact' })
        .eq('school_id', school.id)
        .order('created_at', { ascending: sortStatus.direction === 'asc' })
        .range(start, end);
      if (student_id) {
        query.eq('student_id', student_id);
      }
      if (class_id) {
        query.eq('class_id', class_id);
      }
      return await query;
    },
  });
  const router = useRouter();
  const totalPages = data?.count ? Math.ceil(data.count / pagination.pageSize) : 0;

  return (
    <>
      <Card withBorder radius="md" p="md" className={classes.card}>
        <ScrollArea>
          <Flex align="center" w="100%" pb="sm">
            <TextInput
              w="100%"
              placeholder="Search by full name"
              leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Flex>
          <DataTable
            sortStatus={sortStatus}
            onSortStatusChange={setSortStatus}
            fetching={isLoading}
            verticalSpacing="sm"
            minHeight={300}
            onRowClick={({ record }) => {
              router.push(`/dashboard/${school.id}/classes/${record.class_id}`);
            }}
            records={data?.data || []}
            // @ts-ignore
            columns={columns}
            striped
            highlightOnHover
            loaderColor="orange"
            loaderBackgroundBlur={1}
          />
        </ScrollArea>
        <Card.Section withBorder inheritPadding mt="sm" py="md">
          <Group justify="space-between" align="center" w="100%">
            <Text size="sm" c="dimmed">
              {data ? `Showing ${data?.data?.length || 0} of ${data.count} results` : 'Loading...'}
            </Text>
            <Pagination
              total={totalPages}
              value={pagination.page + 1}
              onChange={(value) =>
                setPagination({
                  page: value - 1,
                  pageSize: pagination.pageSize,
                })
              }
              color="orange"
              size="sm"
            />
          </Group>
        </Card.Section>
      </Card>
    </>
  );
};

export default AssignedClassesDataTable;
