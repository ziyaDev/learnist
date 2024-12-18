'use client';

import { use, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { IconCheck } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { IMaskInput } from 'react-imask';
import { useDebounceValue } from 'usehooks-ts';
import { z } from 'zod';
import {
  Button,
  Checkbox,
  Combobox,
  Fieldset,
  Group,
  Input,
  InputBase,
  Loader,
  Select,
  TextInput,
  useCombobox,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import ClassSelect from '@/components/pages/dashboard/classes-managment/select';
import SpecializationSelect from '@/components/specialises/select-input';
import UploadResume from '@/components/upload/resume';
import { createClient } from '@/supabase/lib/client';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { tanstackQueryClient } from '@/utils/provider/queries';
import StudentSelect from '../../../../select';

const schema = z.object({
  student_id: z.coerce.number().min(1, { message: 'Invalid student id' }),
  class_id: z.coerce.number().min(1, { message: 'Invalid class id' }),
});

export default function NewStudentAssinmentForm({ closeModal }: { closeModal?: () => void }) {
  const form = useForm<z.infer<typeof schema>>({
    mode: 'controlled',
    validate: zodResolver(schema),
  });
  const params = useParams();
  const { school } = useSession();
  const supabase = useSupabase();
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const { data, error } = await supabase.from('student_class_assignments').insert({
        student_id: values.student_id,
        class_id: values.class_id,
        school_id: school.id,
      });
      if (error) {
        notifications.show({
          title: 'Error creating assignment',
          message: error.message,
          color: 'red',
        });
      }
      return;
    },
    onSuccess: async () => {
      tanstackQueryClient.invalidateQueries({
        queryKey: ['students', 'student_class_assignments'],
      });
      closeModal?.();
    },
  });
  useEffect(() => {
    if (params) {
      form.initialize({
        student_id: Number(params.student) as number,
        class_id: Number(params.class || 0) as number,
      });
    }
  }, [params]);

  return (
    <form onSubmit={form.onSubmit((values) => mutate(values))}>
      <Fieldset legend="Basic information">
        <StudentSelect
          key={form.key('student_id')}
          {...form.getInputProps('student_id')}
          disabled
        />
        <ClassSelect key={form.key('class_id')} {...form.getInputProps('class_id')} />
      </Fieldset>

      <Group mt="md" justify="space-between" grow>
        <Button variant="default" type="button">
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          Create
        </Button>
      </Group>
    </form>
  );
}
