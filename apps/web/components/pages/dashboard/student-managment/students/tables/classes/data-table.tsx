'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { Modal } from '@mantine/core';
import { Tables } from '@/supabase/database.types';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { columns } from './columns';

const AssignedClassesDataTable = ({
  opened,
  close,
  rowClicked,
}: {
  opened: boolean;
  close: () => void;
  rowClicked: Tables<'students'> | null;
}) => {
  const { school } = useSession();
  const [selection, setSelection] = useState<Tables<'classes'>[]>([]);
  const supabase = useSupabase();
  const { isLoading, data } = useQuery({
    queryKey: ['classes', rowClicked, school.id],
    queryFn: async () =>
      await supabase.rpc('get_classes_enrollment_for_student', {
        ag_school_id: school.id,
        ag_student_id: rowClicked?.id || 0,
      }),
  });
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        radius={'lg'}
        title={`Assigned Classes for ${rowClicked?.first_name} ${rowClicked?.last_name}`}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        size="xl"
        centered
        withinPortal
        shadow="lg"
      >
        <DataTable
          fetching={isLoading}
          verticalSpacing="sm"
          selectedRecords={selection}
          onSelectedRecordsChange={setSelection}
          minHeight={300}
          withTableBorder
          records={data?.data || []}
          columns={columns}
          striped
          highlightOnHover
          loaderColor="orange"
          loaderBackgroundBlur={1}
        />
      </Modal>
    </>
  );
};

export default AssignedClassesDataTable;
