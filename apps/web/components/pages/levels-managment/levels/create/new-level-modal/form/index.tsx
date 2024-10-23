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
  Select,
  TagsInput,
  TextInput,
  useCombobox,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import SpecializationSelect from '@/components/specialises/select-input';
import UploadResume from '@/components/upload/resume';
import { createClient } from '@/supabase/lib/client';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { tanstackQueryClient } from '@/utils/provider/queries';
import classNames from './style.module.css';

const schema = z.object({
  name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
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

export default function NewLevelForm({ closeModal }: { closeModal?: () => void }) {
  const form = useForm<z.infer<typeof schema>>({
    mode: 'controlled',
    validate: zodResolver(schema),
    initialValues: {
      name: '',
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
        .from('levels')
        .insert({
          name: values.name,
          school_id: school?.id || '',
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
      return supabase.from('levels_sub_fields').insert(
        values.sub_fields.map((field) => ({
          level_id: data.id,
          field: field.label,
          value: field.value,
        }))
      );
    },
    onSuccess: async () => {
      tanstackQueryClient.invalidateQueries({ queryKey: ['levels'] });
      closeModal?.();
    },
  });

  return (
    <form onSubmit={form.onSubmit((values) => mutate(values))}>
      <Fieldset legend="Basic information">
        <TextInput
          withAsterisk
          label="Name of the level"
          key={form.key('name')}
          {...form.getInputProps('name')}
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
