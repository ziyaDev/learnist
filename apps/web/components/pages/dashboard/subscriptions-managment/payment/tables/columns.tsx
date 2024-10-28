'use client';

import { IconDotsVertical, IconEye, IconPrinter } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { DataTableColumn } from 'mantine-datatable';
import { ActionIcon, Avatar, Badge, Box, Group, NumberFormatter, Skeleton, Stack, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { Tables } from '@/supabase/database.types';
import { useSession } from '@/supabase/lib/use-auth';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import useSupabase from '@/supabase/lib/use-supabase';
type student_subscription_classes = Tables<'student_subscription_classes'>
type Query = Tables<"student_subscription"> & { student_subscription_classes: student_subscription_classes[] }
export const columns: DataTableColumn<Query>[] = [
  {
    accessor: "student_id",
    title: 'Student ',
    render: ({ student_id }) => {
      const supabase = useSupabase();
      const { data: student, isLoading } = useQuery({
        queryKey: ['students', student_id],
        queryFn: async () => await supabase.from('students')
          .select('*').eq('id', student_id)
          .single().then(res => res.data),
      });
      const full_name = student?.first_name + ' ' + student?.last_name;

      if (isLoading) {
        return <Group gap="sm">
          <Skeleton height={30} width={30} radius={'100%'} color="initials" />
          <Stack gap={3}>
            <Skeleton height={15} width={200} />
            <Skeleton height={8} width={100} />

          </Stack>
        </Group>
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
    accessor: "totle_amount",
    title: 'Total amount',
    render: ({ student_subscription_classes }) => {
      const { school } = useSession()
      return <NumberFormatter
        suffix={` ${school.currency}`}
        value={student_subscription_classes.reduce((acc, c) => acc + c.subscription_total, 0)}
        thousandSeparator />
    },
  },

  {
    accessor: 'status',
    title: 'Status',
    render: ({ status }) => <Badge variant='light'
      color={status === 'PAID' ? 'green' : status === "RECOVERED" ? 'orange' : 'red'}>
      {status === 'PAID' ? 'Paid' : status === "RECOVERED" ? 'Recovered' : 'Unpaid'}
    </Badge>,
    sortable: true,
  },
  {
    accessor: 'created_at',
    title: 'Created at',
    render: ({ created_at }) => <Text size="sm" fw={500}>
      {DateTime.fromISO(created_at).toFormat('HH:mm dd LLLL yyyy')}
    </Text>,
    sortable: true,
  },
  {
    accessor: '',

    textAlign: "center",
    render: (company) => (
      <Group justify="flex-end">
        <ActionIcon size="sm" variant="light">
          <IconPrinter size={16} />
        </ActionIcon>
        <ActionIcon size="sm" variant="light">
          <IconDotsVertical size={16} />
        </ActionIcon>

      </Group>
    ),
  },
];
