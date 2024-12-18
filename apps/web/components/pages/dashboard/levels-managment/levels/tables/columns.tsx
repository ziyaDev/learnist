'use client';

import { IconDotsVertical, IconEye } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { DataTableColumn } from 'mantine-datatable';
import { ActionIcon, Avatar, Box, Group, Text } from '@mantine/core';
import { Tables } from '@/supabase/database.types';

export const columns: DataTableColumn<Tables<'levels'>>[] = [
  {
    accessor: 'name',
    title: 'Name',
    sortable: true,
  },

  {
    accessor: 'created_at',
    title: 'Teachers ',
    render: ({ created_at }) => (
      <Avatar.Group>
        <Avatar size="md" color="initials" name="abdo s" />
        <Avatar size="md" color="initials" name="das dy" />
        <Avatar size="md" color="initials" name="lorem2 s" />
        <Avatar size="md" color="initials">
          +5
        </Avatar>
      </Avatar.Group>
    ),
    sortable: true,
  },
  {
    accessor: 'created_at',
    title: 'Students ',
    render: ({ created_at }) => (
      <Avatar.Group>
        <Avatar size="md" color="initials" name="ojs iash" />
        <Avatar size="md" color="initials" name="tas jsa" />
        <Avatar size="md" color="initials" name="ojas ts" />
        <Avatar size="md" color="initials">
          +5
        </Avatar>
      </Avatar.Group>
    ),
    sortable: true,
  },
  {
    accessor: 'created_at',
    title: 'Classes ',
    render: ({ created_at }) => 20,
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
