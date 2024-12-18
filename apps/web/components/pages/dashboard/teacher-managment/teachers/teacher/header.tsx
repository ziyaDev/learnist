'use client';

import { useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IconBook, IconHistory } from '@tabler/icons-react';
import { Tabs } from '@mantine/core';

export const TeacherHeader = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const { replace } = useRouter();
  function handleChange(value: string | null) {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set('show', value);
      } else {
        params.delete('show');
      }
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <Tabs onChange={handleChange} value={searchParams.get('show') || 'payment_history'}>
      <Tabs.List>
        <Tabs.Tab
          disabled={pending}
          value="payment_history"
          leftSection={<IconHistory size={18} />}
        >
          Payment history
        </Tabs.Tab>
        <Tabs.Tab disabled={pending} value="assigned_classes" leftSection={<IconBook size={18} />}>
          Assigned classes
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
};
