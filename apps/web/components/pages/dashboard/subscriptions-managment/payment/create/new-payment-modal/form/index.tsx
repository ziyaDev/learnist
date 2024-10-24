'use client';

import { IconCheck, IconTrash } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import {
  ActionIcon,
  Button,
  Checkbox,
  Combobox,
  Fieldset,
  Group,
  Input,
  InputBase,
  Loader,
  NumberInput,
  Select,
  Stack,
  Switch,
  TagsInput,
  TextInput,
  useCombobox,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { tanstackQueryClient } from '@/utils/provider/queries';
import classNames from './style.module.css';
import ClassSelect from '@/components/pages/dashboard/classes-managment/select';
import StudentSelect from '@/components/pages/dashboard/student-managment/select';

const schema = z.object({
  student_id: z.coerce.number(),
  targeted_classes: z.array(
    z.object({
      class_id: z.coerce.number(),
      period: z.coerce.number(),
      period_type: z.string(z.enum(['month', 'day'])),
      key: z.string(),
    })
  ),


  sub_fields: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        key: z.string(),
      })
    )
    .max(10),
});
type FormType = z.infer<typeof schema>;

const defaultValues = {
  // we pass only values we need at first render
  targeted_classes: [
    {
      class_id: 0,
      period: 1,
      period_type: "month",
      key: randomId(),
    }
  ],
  sub_fields: [
    {
      label: '',
      value: '',
      key: randomId(),
    },
  ],
} as FormType; // to avoid the missing fields initialValues
export default function NewPaymentForm({ closeModal }: { closeModal?: () => void }) {
  const form = useForm<FormType>({
    mode: 'controlled',
    validate: zodResolver(schema),
    initialValues: defaultValues,
  });
  const { school } = useSession();
  const supabase = useSupabase();
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const { data, error } = await supabase
        .from('student_payment')
        .insert({
          school_id: school?.id || '',
          student_id: values.student_id
        })
        .select('id')
        .single();
      if (!data || error) {
        notifications.show({
          title: 'Error creating payment',
          message: error.message,
          color: 'red',
        });
        return;
      }
      const filterd = values.sub_fields.filter((field) => field.label !== '' || field.value !== '')
      if (!filterd.length) {
        return;
      }
      await supabase.from('classes_sub_fields').insert(
        filterd.map((field) => ({
          class_id: data.id,
          field: field.label,
          value: field.value,
        }))
      );
    },
    onSuccess: async () => {
      tanstackQueryClient.invalidateQueries({ queryKey: ['classes'] });
      closeModal?.();
    },
    onError: (error) => {
      notifications.show({
        title: 'Error creating class',
        message: error.message,
        color: 'red',
      });
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => mutate(values))}>
      <Fieldset legend="Basic information">
        <StudentSelect
          key={form.key('student_id')}
          {...form.getInputProps('student_id')}
        />

      </Fieldset>
      <Fieldset legend="Targeted classes">
        {form.getValues().targeted_classes.map((field, index) => {
          return (
            <Fieldset legend={`Target ${index + 1}:`} key={field.key} mt="xs">
              <ClassSelect
                key={form.key(`targeted_classes.${index}.class_id`)}
                {...form.getInputProps(`targeted_classes.${index}.class_id`)}
              />
              <Select
                label="Period type"
                withAsterisk
                defaultValue={'month'}
                key={form.key(`targeted_classes.${index}.period_type`)}
                {...form.getInputProps(`targeted_classes.${index}.period_type`)}
                data={['Day', 'Month']}
              />
              <TextInput
                label="Period"
                placeholder="1"
                withAsterisk
                key={form.key(`targeted_classes.${index}.period`)}
                {...form.getInputProps(`targeted_classes.${index}.period`)}
              />
            </Fieldset>
          );
        })}
        <Group justify="center" mt="md" className={classNames.dashedBorder}>
          <Button
            size='compact-sm'
            variant="default"
            onClick={() =>
              form.insertListItem('targeted_classes', {
                label: '',
                value: '',
                key: randomId(),
              })
            }
          >
            Add class
          </Button>
        </Group>
      </Fieldset>
      <Fieldset legend="Additional information">
        {form.getValues().sub_fields.map((field, index) => {
          return (
            <Group key={field.key} mt="xs">
              <TextInput
                placeholder="John Doe"
                withAsterisk
                style={{ flex: 1 }}
                key={form.key(`sub_fields.${index}.label`)}
                {...form.getInputProps(`sub_fields.${index}.label`)}
              />
              <TextInput
                placeholder="John Doe"
                withAsterisk
                style={{ flex: 1 }}
                key={form.key(`sub_fields.${index}.value`)}
                {...form.getInputProps(`sub_fields.${index}.value`)}
              />

              <ActionIcon color="red" onClick={() => form.removeListItem('sub_fields', index)}>
                <IconTrash size="1rem" />
              </ActionIcon>
            </Group>
          );
        })}
        <Group justify="center" mt="md" className={classNames.dashedBorder}>
          <Button
            variant="default"
            size='compact-sm'
            onClick={() =>
              form.insertListItem('sub_fields', {
                label: '',
                value: '',
                key: randomId(),
              })
            }
          >
            Add field
          </Button>
        </Group>
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
