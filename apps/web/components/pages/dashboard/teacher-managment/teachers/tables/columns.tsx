'use client';

import { IconDotsVertical, IconEye, IconSchool } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { DataTableColumn } from 'mantine-datatable';
import { ActionIcon, Avatar, Group, Stack, Text } from '@mantine/core';
import { Tables } from '@/supabase/database.types';

export const columns: DataTableColumn<Tables<'teachers'>>[] = [
  {
    accessor: 'first_name',
    title: 'Full name',
    render: (teacher) => {
      const full_name = teacher.first_name + ' ' + teacher.last_name;
      return (
        <Group gap="sm">
          <Avatar size={30} name={full_name} radius={'md'} color="initials" >
            <IconSchool size={18} />
          </Avatar>
          <Stack gap={0}>
            <Text size="sm" fw={500}>
              {full_name}
            </Text>
            <Group gap={3}>
              <Text c={'dimmed'} size="xs" fw={500}>
                {teacher?.contact_email || 'No contact email'}
              </Text>
              <Text size="xs" fw={500}>
                •
              </Text>

              <Text c={'dimmed'} size="xs" fw={500}>
                {teacher?.contact_phone || 'No contact phone'}
              </Text>
            </Group>
          </Stack>
        </Group>
      );
    },
    sortable: true,
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
      <ActionIcon size="sm" variant="light" onClick={(e) => e.stopPropagation()}>
        <IconDotsVertical size={16} />
      </ActionIcon>
    ),
  },
];
