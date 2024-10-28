'use client';

import { IconDotsVertical, IconEye } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { DataTableColumn } from 'mantine-datatable';
import { ActionIcon, Avatar, Badge, Box, Group, NumberFormatter, Skeleton, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { Tables } from '@/supabase/database.types';
import { useSession } from '@/supabase/lib/use-auth';
import { useDisclosure } from '@mantine/hooks';
import AssignedStudentsDataTable from './students/data-table';
import { useQuery } from '@tanstack/react-query';
import useSupabase from '@/supabase/lib/use-supabase';

export const columns: DataTableColumn<Tables<'classes'>>[] = [
  {
    accessor: 'name',
    title: 'Name',
    sortable: true,
  },
  {
    accessor: 'price',
    title: 'Pricing',
    render: ({ price }) => {
      const { school } = useSession()
      return <NumberFormatter suffix={` ${school.currency}`} value={price} thousandSeparator />
    },
    sortable: true,
  },

  {
    accessor: 'created_at',
    title: 'Students ',
    render: (rowClicked) => {
      const [opened, { open, close }] = useDisclosure(false);
      const { school } = useSession()
      const supabase = useSupabase();
      const { isLoading, data } = useQuery({
        queryKey: ['students_assigned_to_class', rowClicked, school.id],
        queryFn: async () =>
          await supabase.rpc('get_student_enrollment_in_class', {
            ag_school_id: school.id,
            ag_class_id: rowClicked?.id || 0,
          }, { count: "exact" }),
      });
      if (!data && isLoading) {
        return <Avatar.Group>
          <Avatar size='md' color="initials"> </Avatar>
          <Avatar size='md' color="initials"> </Avatar>
          <Avatar size='md' color="initials"> </Avatar>
          <Avatar size='md' color="initials"> </Avatar>
        </Avatar.Group>
      }
      if (!data?.count || data.count === 0) {
        return <>No students found</>

      }
      return (
        <>
          <Tooltip label="Click for more details " >
            <Avatar.Group component={UnstyledButton} onClick={open}>
              {data?.data.map((student, idx) => {
                if (idx >= 3) return null;
                return (
                  <Avatar size='md' color="initials"
                    key={student.id} name={`${student.first_name} ${student.last_name}`} />
                )
              }
              )}
              {data?.count > 3 &&
                <Avatar size='md' color="initials">+{data?.count - 3}
                </Avatar>
              }
            </Avatar.Group>
          </Tooltip>
          <AssignedStudentsDataTable opened={opened} close={close} rowClicked={rowClicked} />
        </>
      )
    },
    sortable: true,
  },
  {
    accessor: 'is_started',
    title: 'Status',
    render: ({ is_started }) => <Badge
      variant='light'
      color={is_started ? 'blue' : 'gray'}>{is_started ? 'In Session' : 'Not started'}</Badge>,
    sortable: true,
  },
  {
    accessor: 'created_at',
    title: 'Created at',
    render: ({ created_at }) => DateTime.fromISO(created_at).toFormat('dd LLLL yyyy'),
    sortable: true,
  },
  {
    accessor: 'actions',

    textAlign: 'center',
    render: (company) => (
      <ActionIcon size="sm" variant="light">
        <IconDotsVertical size={16} />
      </ActionIcon>
    ),
  },
];
