import { IconAt, IconPhoneCall } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { Avatar, Group, SimpleGrid, Text } from '@mantine/core';
import { Tables } from '@/supabase/database.types';
import classes from './style.module.css';

export function StudentInfo({
  first_name,
  last_name,
  id,
  contact_email,
  contact_phone,
  created_at,
}: Tables<'students'>) {
  const full_name = `${first_name} ${last_name}`;
  return (
    <Group wrap="nowrap">
      <Avatar size={94} name={full_name} radius={26} color="initials" />
      <div>
        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
          Joined since {DateTime.fromISO(created_at).toFormat('dd MMM yyyy')}
        </Text>

        <Text fz="lg" fw={500} className={classes.name}>
          {full_name}
        </Text>

        <Group wrap="nowrap" gap={10} mt={3}>
          <IconAt stroke={1.5} size="1rem" className={classes.icon} />
          <Text fz="xs" c="dimmed">
            {contact_email || 'No contact email'}
          </Text>
        </Group>

        <Group wrap="nowrap" gap={10} mt={5}>
          <IconPhoneCall stroke={1.5} size="1rem" className={classes.icon} />
          <Text fz="xs" c="dimmed">
            {contact_phone || 'No contact phone'}
          </Text>
        </Group>
      </div>
    </Group>
  );
}
