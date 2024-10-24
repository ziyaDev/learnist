'use client';

import { IconDotsVertical, IconEye } from '@tabler/icons-react';
import { ColumnDef } from '@tanstack/react-table';
import { DateTime } from 'luxon';
import { DataTableColumn } from 'mantine-datatable';
import { ActionIcon, Avatar, Box, Group, NumberFormatter, Skeleton, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { Tables } from '@/supabase/database.types';
import { useSession } from '@/supabase/lib/use-auth';
import { useDisclosure } from '@mantine/hooks';
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
