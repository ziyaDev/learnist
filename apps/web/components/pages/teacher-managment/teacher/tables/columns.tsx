'use client';

import { IconDotsVertical, IconEye } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { DataTableColumn } from 'mantine-datatable';
import { ActionIcon, Avatar, Box, Group, Text } from '@mantine/core';
import { Tables } from '@/supabase/database.types';

export const columns: DataTableColumn<Tables<'students'>>[] = [
  {
    accessor: 'first_name',
    title: 'Full name',
    render: (student) => {
      const full_name = student.first_name + ' ' + student.last_name;
      return (
        <Group gap="sm">
          <Avatar size={30} name={full_name} radius={26} color="initials" />
          <Text size="sm" fw={500}>
            {full_name}
          </Text>
        </Group>
      );
    },
    sortable: true,
  },

  {
    accessor: 'contact_email',
    title: 'Email',
    sortable: true,
  },
  {
    accessor: 'contact_phone',
    title: 'Phone',
  },
  {
    accessor: 'specialty',
    title: 'Specialization',
    sortable: true,
  },

  {
    accessor: 'created_at',
    title: 'Create at',
    render: ({ created_at }) => DateTime.fromISO(created_at).toFormat('HH:mm, dd LLL yyyy'),

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
