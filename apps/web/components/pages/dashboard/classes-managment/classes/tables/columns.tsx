'use client';

import { IconBooks, IconDotsVertical, IconEye } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { DataTableColumn } from 'mantine-datatable';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Group,
  NumberFormatter,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Tables } from '@/supabase/database.types';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';

export const columns: DataTableColumn<Tables<'classes'>>[] = [
  {
    accessor: 'name',
    title: 'Name',
    render: ({ name }) => {
      return (
        <Group gap="sm">
          <Avatar size={30} name={name} radius={'md'} color="initials" >
            <IconBooks size={18} />
          </Avatar>
          <Stack gap={0}>
            <Text size="sm" fw={500}>
              {name}
            </Text>
          </Stack>
        </Group>
      );
    },
    sortable: true,
  },
  {
    accessor: 'price',
    title: 'Pricing',
    render: ({ price }) => {
      const { school } = useSession();
      return <NumberFormatter suffix={` ${school.currency}`} value={price} thousandSeparator />;
    },
    sortable: true,
  },

  {
    accessor: 'students',
    title: 'Students',
    render: (rowClicked) => {
      const [opened, { open, close }] = useDisclosure(false);
      const { school } = useSession();
      const supabase = useSupabase();
      const { isLoading, data } = useQuery({
        queryKey: ['students_assigned_to_class', rowClicked, school.id],
        queryFn: async () =>
          await supabase.rpc(
            'get_student_enrollment_in_class',
            {
              ag_school_id: school.id,
              ag_class_id: rowClicked?.id || 0,
            },
            { count: 'exact' }
          ),
      });
      if (!data && isLoading) {
        return (
          <Avatar.Group>
            <Avatar size="md" color="initials">
              {' '}
            </Avatar>
            <Avatar size="md" color="initials">
              {' '}
            </Avatar>
            <Avatar size="md" color="initials">
              {' '}
            </Avatar>
            <Avatar size="md" color="initials">
              {' '}
            </Avatar>
          </Avatar.Group>
        );
      }
      if (!data?.count || data.count === 0) {
        return <>No students found</>;
      }
      return (
        <>
          <Avatar.Group>
            {data?.data.map((student, idx) => {
              if (idx >= 3) return null;
              return (
                <Avatar
                  size="md"
                  color="initials"
                  key={student.id}
                  name={`${student.first_name} ${student.last_name}`}
                />
              );
            })}
            {data?.count > 3 && (
              <Avatar size="md" color="initials">
                +{data?.count - 3}
              </Avatar>
            )}
          </Avatar.Group>
        </>
      );
    },
    sortable: true,
  },
  {
    accessor: 'is_started',
    title: 'Status',
    render: ({ is_started }) => (
      <Badge variant="light" color={is_started ? 'blue' : 'gray'}>
        {is_started ? 'In Session' : 'Not started'}
      </Badge>
    ),
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
      <ActionIcon size="sm" variant="light" onClick={(e) => e.stopPropagation()}>
        <IconDotsVertical size={16} />
      </ActionIcon>
    ),
  },
];
