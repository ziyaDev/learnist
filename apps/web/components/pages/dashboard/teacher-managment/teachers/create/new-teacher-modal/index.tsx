'use client';

import dynamic from 'next/dynamic';
import { IconPlus } from '@tabler/icons-react';
import { Button, Center, Drawer, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const NewTeacherForm = dynamic(() => import('./form'), {
  loading: () => (
    <Center w={'100%'} h={600}>
      <Loader />
    </Center>
  ),
  ssr: false,
});

export default function NewTeacherModal() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        radius={'md'}
        offset={12}
        title="New teacher"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        padding={'md'}
        shadow="lg"
        size={'lg'}
        position="left"
      >
        <NewTeacherForm closeModal={close} />
      </Drawer>
      <Button onClick={open} leftSection={<IconPlus size={18} />}>
        Add new teacher
      </Button>
    </>
  );
}
