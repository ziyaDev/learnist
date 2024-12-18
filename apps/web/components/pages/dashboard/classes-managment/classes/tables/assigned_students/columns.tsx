'use client';

import { IconDotsVertical, IconEye, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { DataTableColumn } from 'mantine-datatable';
import { ActionIcon, Avatar, Badge, Box, Group, Stack, Text } from '@mantine/core';
import { Tables } from '@/supabase/database.types';

type Query = Tables<'student_class_assignments'> & {
  students: Tables<'students'> | null;
  classes: Tables<'classes'> | null;
};
export const columns: DataTableColumn<Query>[] = [
  {
    accessor: 'first_name',
    title: 'Full name',
    render: ({ students }) => {
      const full_name = students?.first_name + ' ' + students?.last_name;
      return (
        <Group gap="sm">
          <Avatar size={30} name={full_name} radius={26} color="initials" />
          <Stack gap={0}>
            <Text size="sm" fw={500}>
              {full_name}
            </Text>
            <Group gap={3}>
              <Text c={'dimmed'} size="xs" fw={500}>
                {students?.contact_email || 'No contact email'}
              </Text>
              <Text size="xs" fw={500}>
                •
              </Text>

              <Text c={'dimmed'} size="xs" fw={500}>
                {students?.contact_phone || 'No contact phone'}
              </Text>
            </Group>
          </Stack>
        </Group>
      );
    },
    sortable: true,
  },

  {
    accessor: 'credits_remaining',
    title: 'Subscription status',
    render: ({ credits_remaining }) => (
      <Badge color={credits_remaining > 0 ? 'green' : 'red'}>
        {credits_remaining > 0 ? 'Active' : 'Inactive'}
      </Badge>
    )
  },
  {
    accessor: 'created_at',
    title: 'Assigned at',
    render: ({ created_at }) => DateTime.fromISO(created_at).toFormat('HH:mm, dd LLL yyyy'),
    sortable: true,
  },

  {
    accessor: 'actions',

    textAlign: 'center',
    render: (company) => (
      <ActionIcon size="sm" variant="light" onClick={(e) => e.stopPropagation()}>
        <IconTrash size={18} />
      </ActionIcon>
    ),
  },
];
