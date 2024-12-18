'use client';

import { IconBook, IconDotsVertical, IconEye, IconTrash } from '@tabler/icons-react';
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
    accessor: "classes",
    title: 'Class name',
    render: ({ classes }) => {
      return (
        <Group gap="sm">
          <Avatar size={30} name={classes?.name} radius={'md'} color="initials">
            <IconBook size={18} />

          </Avatar>
          <Stack gap={0}>
            <Text size="sm" fw={500}>
              {classes?.name}
            </Text>
            <Group gap={3}>
              <Text c={'dimmed'} size="xs" fw={500}>
                Started at {DateTime.fromISO(classes?.start_at || '').toFormat('dd MMM yyyy') || 'No start date'}
              </Text>
            </Group>
          </Stack>
        </Group>
      );
    },
  },
  {
    accessor: 'created_at',
    title: 'Joined at',
    render: ({ created_at }) => (
      <Text size="sm" tw="500">
        {DateTime.fromISO(created_at).toFormat('dd MMM yyyy')}
      </Text>
    ),
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
    accessor: 'actions',

    textAlign: 'center',
    render: (company) => (
      <ActionIcon size="sm" variant="light" onClick={(e) => e.stopPropagation()}>
        <IconTrash size={18} />
      </ActionIcon>
    ),
  },
];
