'use client';

import dynamic from 'next/dynamic';
import { IconAddressBook, IconPlus } from '@tabler/icons-react';
import { Button, Center, Drawer, Loader } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const NewStudentAssignmentForm = dynamic(() => import('./form'), {
  loading: () => (
    <Center w={'100%'} h={600}>
      <Loader />
    </Center>
  ),
  ssr: false,
});
export default function NewStudentAssignmentModal() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Drawer
        opened={opened}
        onClose={close}
        radius={'md'}
        offset={12}
        title="New student assignment"
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        padding={'md'}
        shadow="lg"
        size={'lg'}
        position="right"
      >
        <NewStudentAssignmentForm closeModal={close} />
      </Drawer>
      <Button onClick={open} variant="default" leftSection={<IconAddressBook size={18} />}>
        Make an assignment
      </Button>
    </>
  );
}
