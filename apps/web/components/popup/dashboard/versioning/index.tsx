'use client'
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from '@mantine/core';
import { VersioningCard } from "./card";
import { useEffect } from "react";

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

   }, [])

   return <Modal opened={state} onClose={close} withCloseButton={false} padding={0} centered overlayProps={{
      backgroundOpacity: 0.55,
      blur: 3,
   }}>
      <VersioningCard onDimiss={() => close()} />
   </Modal>
}