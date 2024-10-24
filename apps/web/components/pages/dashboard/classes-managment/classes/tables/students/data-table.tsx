'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { Card, Group, Text, Modal, ScrollArea, Pagination } from '@mantine/core';
import { Tables } from '@/supabase/database.types';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { columns } from './columns';

const AssignedStudentsDataTable = ({
  opened,
  close,
  rowClicked,
}: {
  opened: boolean;
  close: () => void;
  rowClicked: Tables<'classes'> | null;
}) => {
  const { school } = useSession();
  const [selection, setSelection] = useState<Tables<'students'>[]>([]);
  const supabase = useSupabase();
  const [pagination, setPagination] = useState<{ page: number; pageSize: number }>({
    page: 0,
    pageSize: 10,
  });
  const { isLoading, data } = useQuery({
    queryKey: ['students_assigned_to_class', rowClicked, school.id],
    queryFn: async () => {
      const start = pagination.page * pagination.pageSize;
      const end = start + pagination.pageSize - 1;
      return await supabase.rpc('get_student_enrollment_in_class', {
        ag_school_id: school.id,
        ag_class_id: rowClicked?.id || 0,
      }, { count: 'exact' }).range(start, end)
    },
  });
  const totalPages = data?.count ? Math.ceil(data.count / pagination.pageSize) : 0;

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        radius={'lg'}
        title={`Assigned Students on ${rowClicked?.name}`}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        size="xl"
        centered
        withinPortal
        shadow="lg"
      >
        <Card withBorder radius="md" p="md" bg={'transparent'}>

          <ScrollArea>

            <DataTable
              fetching={isLoading}
              verticalSpacing="sm"
              selectedRecords={selection}
              onSelectedRecordsChange={setSelection}
              minHeight={300}
              records={data?.data || []}
              columns={columns}
              striped
              highlightOnHover
              loaderColor="orange"
              loaderBackgroundBlur={1}
            />
          </ScrollArea>
          <Card.Section withBorder inheritPadding mt={'sm'} py="md">
            <Group justify="space-between" align={'center'} w="100%">
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
      </Modal>
    </>
  );
};

export default AssignedStudentsDataTable;
