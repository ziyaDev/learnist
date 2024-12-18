'use client'
import { IconAt, IconBooks, IconListNumbers, IconPhoneCall, IconUser } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { Avatar, Group, SimpleGrid, Skeleton, Text } from '@mantine/core';
import { Tables } from '@/supabase/database.types';
import classes from './style.module.css';
import { useSession } from '@/supabase/lib/use-auth';
import { useQuery } from '@tanstack/react-query';
import useSupabase from '@/supabase/lib/use-supabase';

export function ClassInfo({ name, id, created_at }: Tables<'classes'>) {
  const { school } = useSession();
  const supabase = useSupabase();
  const { data, isLoading } = useQuery({
    queryKey: ['classes', id, school.id],
    queryFn: async () => {
      return await supabase.from('student_class_assignments')
        .select('id', {
          count: 'exact',
        })
        .eq('class_id', id);
    }
  })
  if (isLoading) {

    return <Group wrap="nowrap">
      <Skeleton w={94} radius={26} h={94} />
      <div>
        <Skeleton w={180} h={13} my={3} />

        <Skeleton w={150} h={20} />

        <Group wrap="nowrap" gap={10} mt={3}>
          <IconListNumbers stroke={1.5} size="1rem" className={classes.icon} />
          <Skeleton w={80} h={13} />
        </Group>

        <Group wrap="nowrap" gap={10} mt={5}>
          <IconUser stroke={1.5} size="1rem" className={classes.icon} />
          <Skeleton w={80} h={13} />
        </Group>
      </div>
    </Group>

  }
  return (
    <Group wrap="nowrap">
      <Avatar size={94} radius={26} name={name} color="initials">
        <IconBooks size={60} />
      </Avatar>
      <div>
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
          Created on {DateTime.fromISO(created_at).toFormat('dd MMM yyyy')}
        </Text>

        <Text fz="lg" fw={500} className={classes.name}>
          {name}
        </Text>

        <Group wrap="nowrap" gap={10} mt={3}>
          <IconListNumbers stroke={1.5} size="1rem" className={classes.icon} />
          <Text fz="xs" c="dimmed">
            {`${data?.count} students assigned` || 'No students assigned'}
          </Text>
        </Group>

        <Group wrap="nowrap" gap={10} mt={5}>
          <IconUser stroke={1.5} size="1rem" className={classes.icon} />
          <Text fz="xs" c="dimmed">
            {false || 'No teacher assigned'}
          </Text>
        </Group>
      </div>
    </Group>
  );
}
