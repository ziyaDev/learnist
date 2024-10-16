'use client'
import { Button, Modal } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { z } from "zod";
import NewTeacherForm from "./form";


export default function NewTeacherModal() {
   const [opened, { open, close }] = useDisclosure(false);
   return <>
      <Modal
         opened={opened}
         onClose={close}
         title="New teacher"
         overlayProps={{
            backgroundOpacity: 0.55,
            blur: 3,
         }}
         padding={'lg'}
         shadow="lg"
         size={'lg'}
         centered
      >
         <NewTeacherForm />
      </Modal>
      <Button onClick={open} leftSection={<IconPlus size={18} />}>Add new teacher</Button>
   </>
}