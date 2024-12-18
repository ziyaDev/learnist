'use client';

import Link from 'next/link';
import { IconDotsVertical, IconEye, IconPencil, IconPrinter, IconTrash } from '@tabler/icons-react';
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
  Menu,
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

export const columns: DataTableColumn<Tables<'student_class_subscription'>>[] = [
  {
    accessor: 'id',
    title: '#',
    render: ({ id }) => {
      return <Text fw={700}>#{id}</Text>;
    },
  },
  {
    accessor: 'student_id',
    title: 'Student ',
    render: ({ student_id }) => {
      const supabase = useSupabase();
      const { data: student, isLoading } = useQuery({
        queryKey: ['students', student_id],
        queryFn: async () =>
          await supabase
            .from('students')
            .select('*')
            .eq('id', student_id)
            .single()
            .then((res) => res.data),
      });
      const full_name = student?.first_name + ' ' + student?.last_name;

      if (isLoading) {
        return (
          <Group gap="sm">
            <Skeleton height={30} width={30} radius={'100%'} color="initials" />
            <Stack gap={3}>
              <Skeleton height={15} width={200} />
              <Skeleton height={8} width={100} />
            </Stack>
          </Group>
        );
      }
      return (
        <Group gap="sm">
          <Avatar size={30} name={full_name} radius={26} color="initials" />
          <Stack gap={0}>
            <Text size="sm" fw={500}>
              {full_name}
            </Text>
            <Text c={'dimmed'} size="xs" fw={500}>
              {student?.contact_email || 'No contact email'}
            </Text>
          </Stack>
        </Group>
      );
    },
  },

  {
    accessor: 'amount_paid',
    title: 'Total paid',
    render: ({ amount_paid }) => {
      const { school } = useSession();
      return (
        <NumberFormatter suffix={` ${school.currency}`} value={amount_paid} thousandSeparator />
      );
    },
  },

  {
    accessor: 'status',
    title: 'Status',
    render: ({ payment_status }) => (
      <Badge
        variant="light"
        color={
          payment_status === 'PAID' ? 'green' : payment_status === 'RECOVERED' ? 'orange' : 'red'
        }
      >
        {payment_status === 'PAID'
          ? 'Paid'
          : payment_status === 'RECOVERED'
            ? 'Recovered'
            : 'Unpaid'}
      </Badge>
    ),
    sortable: true,
  },
  {
    accessor: 'created_at',
    title: 'Created at',
    render: ({ created_at }) => (
      <Text size="sm" fw={500}>
        {DateTime.fromISO(created_at).toFormat('HH:mm dd LLLL yyyy')}
      </Text>
    ),
    sortable: true,
  },
  {
    accessor: '',

    textAlign: 'center',
    render: (company) => (
      <Group justify="flex-end">
        <ActionIcon size="sm" variant="light" onClick={(e) => e.stopPropagation()}>
          <IconPrinter size={16} />
        </ActionIcon>
        <Menu shadow="md">
          <Menu.Target>
            <ActionIcon size="sm" variant="light" onClick={(e) => e.stopPropagation()}>
              <IconDotsVertical size={16} />
            </ActionIcon>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item leftSection={<IconPencil size={14} />}>Edit</Menu.Item>
            <Menu.Item color="red" leftSection={<IconTrash size={14} />}>
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    ),
  },
];
