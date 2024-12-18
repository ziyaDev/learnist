'use client';

import { useEffect } from 'react';
import { IconCheck, IconTrash } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { z } from 'zod';
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Combobox,
  Fieldset,
  Group,
  Input,
  InputBase,
  Loader,
  LoadingOverlay,
  NumberFormatter,
  NumberInput,
  Select,
  Skeleton,
  Stack,
  Switch,
  TagsInput,
  Text,
  TextInput,
  Title,
  useCombobox,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { UseFieldReturnType, useForm, UseFormReturnType, zodResolver } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { notifications, showNotification } from '@mantine/notifications';
import ClassSelect from '@/components/pages/dashboard/classes-managment/select';
import StudentSelect from '@/components/pages/dashboard/student-managment/select';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { tanstackQueryClient } from '@/utils/provider/queries';
import classNames from './style.module.css';

const schema = z.object({
  student_id: z.coerce.number(),
  is_paid: z.boolean(),
  period: z.coerce.number().min(1),
  class_id: z.coerce.number(),
  total: z.number(),
  total_paid: z.number().optional(),
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
  is_paid: true,
  period: 1,

  sub_fields: [
    {
      label: '',
      value: '',
      key: randomId(),
    },
  ],
} as FormType; // to avoid the missing fields initialValues
export default function NewStudentSubscriptionForm({ closeModal }: { closeModal?: () => void }) {
  const form = useForm<FormType>({
    mode: 'controlled',
    validate: zodResolver(schema),
    initialValues: defaultValues,
  });
  const { school } = useSession();
  const supabase = useSupabase();
  const { mutate, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof schema>) => {
      const { data, error } = await supabase.from('student_class_subscription').insert({
        class_id: values.class_id,
        student_id: values.student_id,
        school_id: school.id,
        payment_status: values.is_paid
          ? 'PAID'
          : values.total_paid === values.total
            ? 'PAID'
            : 'NOT_PAID',
        amount_paid: values.is_paid ? values.total : values.total_paid,
      });
      if (!data && error) {
        notifications.show({
          title: 'Error creating subscription',
          message: error?.message,
          color: 'red',
        });
        return;
      }
      const credits_remaining = async () => {
        const class_details = await supabase
          .from('classes')
          .select('*,class_schedule(*)')
          .eq('id', values.class_id)
          .single();
        if (class_details.error || !class_details.data) {
          return 0;
        }

        const schedule_in_week = class_details.data?.class_schedule.length || 0;
        // calculate the number of credits remaining for the student base on the period (months)
        return (schedule_in_week * 4) * values.period;
      };

      // check if student is already assigned to class
      const assignment = await supabase
        .from('student_class_assignments')
        .select('*')
        .eq('student_id', values.student_id)
        .eq('class_id', values.class_id)
        .maybeSingle()
        .then(async ({ data, error }) => {
          if (error) {
            notifications.show({
              title: 'Error checking if student is already assigned to class',
              message: error.message,
              color: 'red',
            });
            return;
          }
          if (!data) {
            // create assignment for the student with the class
            await supabase.from('student_class_assignments').insert({
              student_id: values.student_id,
              class_id: values.class_id,
              school_id: school.id,
              credits_remaining: await credits_remaining(),
            });
          }
          await supabase
            .from('student_class_assignments')
            .update({
              credits_remaining: await credits_remaining(),
            })
            .eq('student_id', values.student_id)
            .eq('class_id', values.class_id);
        });
    },
    onSuccess: async () => {
      tanstackQueryClient.invalidateQueries({
        queryKey: ['student_class_subscription', school.id],
      });
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
        <StudentSelect key={form.key('student_id')} {...form.getInputProps('student_id')} />

        <Input.Wrapper mt={'sm'}>
          <Switch
            description="Enable this option to mark the student as paid"
            label="Mark as paid"
            mt="xs"
            key={form.key(`is_paid`)}
            defaultChecked={form.getValues().is_paid}
            {...form.getInputProps(`is_paid`)}
          />
        </Input.Wrapper>
      </Fieldset>

      <Fieldset legend={`Targeted class:`} mt="xs">
        <ClassSelect key={form.key(`class_id`)} {...form.getInputProps(`class_id`)} />
        <NumberInput
          label="Period (monthly)"
          min={1}
          description="The period that the student will be paying for"
          placeholder="1"
          withAsterisk
          key={form.key(`period`)}
          {...form.getInputProps(`period`)}
        />
      </Fieldset>
      <TotalSummary form={form} />

      <NumberInput
        label="Payed amount"
        min={1}
        disabled={form.getValues().is_paid}
        description="The amout of money paid by the student"
        placeholder="1"
        withAsterisk
        key={form.key(`total_paid`)}
        {...form.getInputProps(`total_paid`)}
      />

      <Group mt="md" justify="space-between" grow>
        <Button variant="default" type="button">
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          Confirm and create
        </Button>
      </Group>
    </form>
  );
}

const TotalSummary = ({ form }: { form: UseFormReturnType<FormType> }) => {
  const supabase = useSupabase();
  const { data, isLoading, error } = useQuery({
    queryKey: ['classes', form.getValues().class_id],
    queryFn: async () =>
      await supabase
        .from('classes')
        .select('*')
        .eq('id', form.getValues().class_id)
        .single()
        .then((res) => res.data),
  });
  useEffect(() => {
    if (data) {
      form.setValues({ total: data?.price * form.getValues().period || 0 });
    }
  }, [data]);
  if (isLoading) {
    return (
      <Group justify="center" mt="md" className={classNames.dashedBorder}>
        <Skeleton height={25} width={200} />
      </Group>
    );
  }
  if (!data || error) {
    return (
      <Group justify="center" mt="md" className={classNames.dashedBorder}>
        <Title order={4}>Total is:</Title>
        <Title order={4}>
          <NumberFormatter suffix=" DZD" value={0} thousandSeparator />
        </Title>
      </Group>
    );
  }

  return (
    <Group justify="center" mt="md" className={classNames.dashedBorder}>
      <Title order={4}>Total is:</Title>
      <Title order={4}>
        <NumberFormatter
          suffix=" DZD"
          value={data.price * form.getValues().period}
          thousandSeparator
        />
      </Title>
    </Group>
  );
};
