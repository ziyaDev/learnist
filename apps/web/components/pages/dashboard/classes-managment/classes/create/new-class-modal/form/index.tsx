'use client';

import { IconCheck, IconClock, IconTrash } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';
import { DateTime, WeekdayNumbers } from 'luxon';
import { z } from 'zod';
import {
  ActionIcon,
  Button,
  Checkbox,
  Chip,
  Combobox,
  Fieldset,
  Flex,
  Group,
  Input,
  InputBase,
  Loader,
  NumberInput,
  Select,
  TagsInput,
  TextInput,
  useCombobox,
} from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { useForm, zodResolver } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { tanstackQueryClient } from '@/utils/provider/queries';
import LevelSelect from '../../../../../levels-managment/select';
import classNames from './style.module.css';

const days = Array.from({ length: 7 }, (_, i) =>
  DateTime.fromObject({ weekday: (i + 1) as WeekdayNumbers })
    .toFormat('ccc')
    .toLowerCase()
);
const schema = z.object({
  name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
  level_id: z.coerce.number(),
  price: z.coerce.number().min(0, { message: 'Price should be greater than 0' }),
  schedule: z.array(
    z.object({
      key: z.string(),
      day: z.string().refine((arg) => days.includes(arg.toLocaleLowerCase())),
      start_time: z
        .string()
        .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
          message: 'Invalid time format. Expected format is hh:mm in 24-hour time',
        }),
      end_time: z
        .string()
        .regex(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/, {
          message: 'Invalid time format. Expected format is hh:mm in 24-hour time',
        }),
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
const initializValues = {
  sub_fields: [
    {
      label: '',
      value: '',
      key: randomId(),
    },
  ],
  schedule: [
    {
      day: 'su',
      key: randomId(),
    },
  ],
} as z.infer<typeof schema>;
export default function NewClassForm({ closeModal }: { closeModal?: () => void }) {
  const form = useForm<z.infer<typeof schema>>({
    mode: 'controlled',
    validate: zodResolver(schema),
    initialValues: initializValues,
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
          price: values.price,
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
      const schedule = await supabase.from('class_schedule').insert(
        // @ts-ignore @ts-expect-error Expected day_of_week to be enum of type 'DayOfWeek'
        // but got string instead.
        values.schedule.map((field) => ({
          class_id: data.id,
          day_of_week: field.day,
          start_time: field.start_time,
          end_time: field.end_time,
        }))
      );

      if (schedule.error) {
        let promiss = true;
        notifications.show({
          title: 'Error creating class schedule, Deleting the class',
          message: schedule.error.message,
          color: 'red',
          loading: promiss,
        });
        await supabase
          .from('classes')
          .delete()
          .eq('id', data.id)
          .single()
          .then((res) => {
            if (res.error) {
              notifications.show({
                title: 'Error deleting class',
                message: res.error.message,
                color: 'red',
                loading: promiss,
              });
            }
            promiss = false;
            notifications.show({
              title: 'Class deleted',
              message: 'Class deleted successfully',
              color: 'green',
            });
          });
      }
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
        <LevelSelect key={form.key('level_id')} {...form.getInputProps('level_id')} />
      </Fieldset>
      <Fieldset legend="Scheduling">
        {form.getValues().schedule.map((field, index) => {
          return (
            <Fieldset key={field.key} legend={`Scheduling for ${index + 1} target`}>
              <Select
                label="Day of the week"
                placeholder="Pick day"
                key={form.key(`schedule.${index}.day`)}
                checkIconPosition="right"
                {...form.getInputProps(`schedule.${index}.day`)}
                data={Array.from({ length: 7 }, (_, i) =>
                  DateTime.fromObject({ weekday: (i + 1) as WeekdayNumbers }).toFormat('cccc')
                ).map((day) => {
                  return { label: day, value: day.slice(0, 3).toLowerCase() };
                })}
              />

              <Group justify="center" grow>
                <TimeInput
                  leftSection={<IconClock size={18} />}
                  label="Start time"
                  key={form.key(`schedule.${index}.start_time`)}
                  {...form.getInputProps(`schedule.${index}.start_time`)}
                />
                <TimeInput
                  leftSection={<IconClock size={18} />}
                  label="End time"
                  key={form.key(`schedule.${index}.end_time`)}
                  {...form.getInputProps(`schedule.${index}.end_time`)}
                />
              </Group>
              <Group justify="center" mt="md" className={classNames.dashedBorder}>
                <Button
                  color="red"
                  size="xs"
                  disabled={form.getValues().schedule.length === 1}
                  onClick={() => form.removeListItem('schedule', index)}
                >
                  Remove
                </Button>
              </Group>
            </Fieldset>
          );
        })}
        <Group justify="center" mt="md" className={classNames.dashedBorder}>
          <Button
            variant="default"
            size="xs"
            disabled={form.getValues().schedule.length >= 7}
            onClick={() =>
              form.insertListItem('schedule', {
                day: DateTime.now().toFormat('ccc').toLowerCase(),
                key: randomId(),
                start_time: DateTime.now().toFormat('HH:mm'),
                end_time: DateTime.now().plus({ hours: 1 }).toFormat('HH:mm'),
              })
            }
          >
            Add field
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
            size="xs"
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
