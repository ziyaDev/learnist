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
import LevelSelect from '../../../../../levels-managment/select';
import classNames from './style.module.css';

const schema = z.object({
  name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
  level_id: z.coerce.number(),
  price: z.coerce.number().min(0, { message: 'Price should be greater than 0' }),
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

export default function NewClassForm({ closeModal }: { closeModal?: () => void }) {
  const form = useForm<z.infer<typeof schema>>({
    mode: 'controlled',
    validate: zodResolver(schema),
    initialValues: {
      name: '',
      price: 0,
      level_id: 0,
      sub_fields: [
        {
          label: '',
          value: '',
          key: randomId(),
        },
      ],
    },
  });
  const { school } = useSession();
  const supabase = useSupabase();
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const { data, error } = await supabase
        .from('classes')
        .insert({
          name: values.name,
          school_id: school?.id || '',
          level_id: Number(values.level_id),
          price: values.price
        })
        .select('id')
        .single();
      if (!data || error) {
        notifications.show({
          title: 'Error creating class',
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
        <TextInput
          withAsterisk
          label="Name of the class"
          key={form.key('name')}
          {...form.getInputProps('name')}
        />
        <NumberInput
          withAsterisk
          label="Pricing"
          placeholder="0"
          key={form.key('price')}
          {...form.getInputProps('price')}
        />
        <LevelSelect

          key={form.key('level_id')}
          {...form.getInputProps('level_id')}
        />
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
