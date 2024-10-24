'use client';

import { useEffect } from 'react';
import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { VersioningCard } from './card';

interface Props {
  opened: boolean;
  onClose: () => Promise<any>;
}
export default function PopupVersioning({ opened }: Props) {
  const [state, { open, close }] = useDisclosure(false);

  useEffect(() => {
    setTimeout(() => {
      open();
    }, 1000);
  }, []);

  return (
    <Modal
      opened={false}
      onClose={close}
      withCloseButton={false}
      padding={0}
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <VersioningCard onDimiss={() => close()} />
    </Modal>
  );
}
