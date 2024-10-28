'use client';

import { IconCheck, IconTrash } from '@tabler/icons-react';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  Text,
  useCombobox,
  Title,
  Skeleton,
  NumberFormatter,
  Box,
  LoadingOverlay,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { UseFieldReturnType, useForm, UseFormReturnType, zodResolver } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { tanstackQueryClient } from '@/utils/provider/queries';
import classNames from './style.module.css';
import ClassSelect from '@/components/pages/dashboard/classes-managment/select';
import StudentSelect from '@/components/pages/dashboard/student-managment/select';
import { DateTime } from 'luxon';
import { useEffect } from 'react';

const schema = z.object({
  student_id: z.coerce.number(),
  auto_assign: z.boolean().default(true),
  is_paid: z.boolean(),
  targeted_classes: z.array(
    z.object({
      class_id: z.coerce.number(),
      period: z.coerce.number().min(1),
      auto_assign: z.boolean().optional(),
      start_date: z.coerce.date().optional(),
      total: z.number(),
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
}).superRefine((args, ctx) => {

  args.targeted_classes.forEach((targeted_class, index) => {
    if (!targeted_class.auto_assign && !targeted_class.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date is required when auto assign is not enabled',
        path: [`targeted_classes.${index}.start_date`],
      });
    }
  })
})


type FormType = z.infer<typeof schema>;

const defaultValues = {
  auto_assign: true,
  is_paid: true,
  // we pass only values we need at first render
  targeted_classes: [
    {
      class_id: 0,
      period: 1,
      total: 0,
      auto_assign: false,
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
      // const { data, error } = await supabase
      //   .from("student_subscription")
      //   .insert({
      //     school_id: school?.id || '',
      //     student_id: values.student_id,
      //     targeted_classes: values.targeted_classes.map((targeted_class) => ({
      //       class_id: targeted_class.class_id,
      //       period: targeted_class.period,
      //       auto_assign: targeted_class.auto_assign,
      //       start_date: targeted_class.start_date,
      //       total: targeted_class.total,
      //       last_amount_paid: targeted_class.total,
      //     }))
      //   })
      //   .select('id')
      //   .single();
      const { data, error } = await supabase.rpc("create_student_subscription", {
        ag_school_id: school?.id || '',
        ag_student_id: values.student_id,
        ag_auto_assign_student_to_classes: values.auto_assign,
        ag_is_paid: values.is_paid,
        student_subscription_class: values.targeted_classes.map((targeted_class) => ({
          ag_class_id: targeted_class.class_id,
          ag_end_date: targeted_class.start_date?.toISOString() || null,
          ag_period: targeted_class.period,
          ag_automatically_assign_start_date: targeted_class.auto_assign || false,
        }))
      })
      if (!data || error) {
        notifications.show({
          title: 'Error creating subscription',
          message: error?.message,
          color: 'red',
        });
        return;
      }
      // const filterd = values.sub_fields.filter((field) => field.label !== '' || field.value !== '')
      // if (!filterd.length) {
      //   return;
      // }
      // await supabase.from('sub_fields').insert(
      //   filterd.map((field) => ({
      //     assigned_table_id: data.id,
      //     school_id: school?.id || '',
      //     field: field.label,
      //     value: field.value,
      //   }))
      // );
    },
    onSuccess: async () => {
      tanstackQueryClient.invalidateQueries({ queryKey: ['student_subscription', school.id] });
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
        <Input.Wrapper mt={'sm'} >
          <Switch
            description="Enable this option to automatically assign student to the class"
            label="Automatically assign to class"
            mt='xs'
            key={form.key(`auto_assign`)}
            defaultChecked={form.getValues().auto_assign}
            {...form.getInputProps(`auto_assign`)}
          />
        </Input.Wrapper>


      </Fieldset>
      <Fieldset legend="Targeted classes">
        {form.getValues().targeted_classes.map((field, index) => {
          return <TargetedClassesForm index={index} form={form} key={field.key} />
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

      <Group justify="center" mt="md" className={classNames.dashedBorder}>
        <Title order={4}>Total is:</Title>
        <Title order={4}>
          <NumberFormatter suffix=" DZD"
            value={form.getValues().targeted_classes.reduce((acc, curr) => acc + curr.total, 0)}
            thousandSeparator
          />
        </Title>

      </Group>
      <Input.Wrapper mt={'sm'} >
        <Switch
          description="Enable this option to mark the student as paid"
          label="Mark as paid"
          mt='xs'
          key={form.key(`is_paid`)}
          defaultChecked={form.getValues().is_paid}
          {...form.getInputProps(`is_paid`)}
        />
      </Input.Wrapper>
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

const TargetedClassesForm = ({ form, index }: { form: UseFormReturnType<FormType>, index: number }) => {
  const supabase = useSupabase()
  const { } = useQuery({
    queryKey: ['classes'],
    queryFn: async () =>
      await supabase.from('classes').select('*').eq('id', form.getValues().targeted_classes[index].class_id).single().then(res => res.data)
    ,
  })

  return <Fieldset legend={`Target ${index + 1}:`} mt="xs">
    <ClassSelect
      key={form.key(`targeted_classes.${index}.class_id`)}
      {...form.getInputProps(`targeted_classes.${index}.class_id`)}
    />
    <NumberInput
      label="Period (monthly)"
      min={1}
      description="The period that the student will be paying for"
      placeholder="1"
      withAsterisk
      key={form.key(`targeted_classes.${index}.period`)}
      {...form.getInputProps(`targeted_classes.${index}.period`)}
    />
    <DateInput
      valueFormat="YYYY MMM DD"
      label="Start date"
      description="The date when the student will start the class, also when the subscription starts"
      minDate={new Date()}
      size='sm'
      placeholder={`Today's ${DateTime.fromJSDate(new Date()).toFormat('yyyy MMM dd')}`}
      key={form.key(`targeted_classes.${index}.start_date`)}
      disabled={form.getValues().targeted_classes[index].auto_assign}
      {...form.getInputProps(`targeted_classes.${index}.start_date`)}
    />
    <Input.Wrapper mt={'sm'}>
      <Switch
        label="Automatically assign start date when class starts"
        description="Enable this option to automatically assign the start date when the class starts"
        key={form.key(`targeted_classes.${index}.auto_assign`)}
        {...form.getInputProps(`targeted_classes.${index}.auto_assign`)}
      />
    </Input.Wrapper>
    <Group justify="center" mt="md" className={classNames.dashedBorder}>


      <ClassTotalPriceCalculator
        period={form.getValues().targeted_classes[index].period}
        class_id={form.getValues().targeted_classes[index].class_id}
        onValueChange={(value) => {
          form.setFieldValue(`targeted_classes.${index}.total`, value);
        }}
      />




    </Group>
    <Group justify="center" mt="md" className={classNames.border}>

      <Button disabled={form.getValues().targeted_classes.length <= 1} onClick={() => form.removeListItem('targeted_classes', index)} color="red" size="xs">
        Remove
      </Button>
    </Group>
  </Fieldset>

}




type ClassTotalPriceCalculatorProps = {
  class_id: number;
  period: number;
  onValueChange: (value: number) => void;
}

const ClassTotalPriceCalculator = ({ class_id, period, onValueChange }: ClassTotalPriceCalculatorProps) => {
  const supabase = useSupabase();
  const { data, isLoading, error } = useQuery({
    queryKey: ['classes', class_id],
    queryFn: async () => await supabase.from('classes').select('price').eq('id', class_id).single().then(res => res.data),
    enabled: !!class_id,
  });
  useEffect(() => {
    if (data) {
      onValueChange(data.price * period)
    }
  }, [data, period])
  if (!class_id) {
    return <>
      <Title order={4}>Target total:</Title>
      <Title order={4}>
        <NumberFormatter suffix=" DZD" value={0} thousandSeparator />
      </Title>
    </>
  }
  if (isLoading) {
    return <Skeleton height={30} width={300} />
  }
  if (!data || error) {
    return <Text size="sm">
      Error calculating price
    </Text>
  }

  return <>
    <Title order={4}>Target total:</Title>
    <Title order={4}>
      <NumberFormatter suffix=" DZD" value={data.price * period} thousandSeparator />
    </Title>
  </>


}