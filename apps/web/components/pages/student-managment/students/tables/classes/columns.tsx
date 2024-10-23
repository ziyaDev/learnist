'use client';

import { IconDotsVertical, IconEye, IconTrash } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { DataTableColumn } from 'mantine-datatable';
import { ActionIcon, Avatar, Box, Group, Text } from '@mantine/core';
import { Tables } from '@/supabase/database.types';

export const columns: DataTableColumn<Tables<'classes'>>[] = [
  {
    accessor: 'name',
    title: 'Name',
  },

  {
    accessor: 'actions',

    textAlign: 'center',
    render: (company) => (
      <ActionIcon size="sm" variant="light">
        <IconTrash size={18} />
      </ActionIcon>
    ),
  },
];
