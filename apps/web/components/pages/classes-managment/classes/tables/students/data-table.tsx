'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';
import { Modal } from '@mantine/core';
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
  const { isLoading, data } = useQuery({
    queryKey: ['students', rowClicked, school.id],
    queryFn: async () =>
      await supabase.rpc('get_student_enrollment_in_class', {
        ag_school_id: school.id,
        ag_class_id: rowClicked?.id || 0,
      }),
  });
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
        <DataTable
          fetching={isLoading}
          verticalSpacing="sm"
          selectedRecords={selection}
          withTableBorder
          onSelectedRecordsChange={setSelection}
          minHeight={300}
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

export default AssignedStudentsDataTable;
