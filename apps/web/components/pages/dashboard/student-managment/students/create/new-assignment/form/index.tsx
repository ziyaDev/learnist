'use client';

import { use, useEffect, useState } from 'react';
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
import SpecializationSelect from '@/components/specialises/select-input';
import UploadResume from '@/components/upload/resume';
import { createClient } from '@/supabase/lib/client';
import { useSession } from '@/supabase/lib/use-auth';
import useSupabase from '@/supabase/lib/use-supabase';
import { tanstackQueryClient } from '@/utils/provider/queries';

const schema = z.object({
     first_name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
     last_name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
     contact_email: z.string().email({ message: 'Invalid email' }).optional(),
     contact_phone: z.string().optional(),
});

export default function NewStudentAssinmentForm({ closeModal }: { closeModal?: () => void }) {
     const form = useForm<z.infer<typeof schema>>({
          mode: 'controlled',
          validate: zodResolver(schema),
     });
     const { school } = useSession();
     const supabase = useSupabase();
     const { mutate, isPending } = useMutation({
          mutationFn: async (values: z.infer<typeof schema>) => {
               return supabase.from('students').insert({
                    first_name: values.first_name,
                    last_name: values.last_name,
                    contact_email: values.contact_email,
                    contact_phone: values.contact_phone,
                    school_id: school?.id || '',
               });
          },
          onSuccess: async () => {
               tanstackQueryClient.invalidateQueries({ queryKey: ['students'] });
               closeModal?.();
          },
     });

     return (
          <form onSubmit={form.onSubmit((values) => mutate(values))} >
               <Fieldset legend="Basic information">
                    <TextInput
                         withAsterisk
                         label="First name"
                         key={form.key('first_name')}
                         {...form.getInputProps('first_name')}
                    />
                    <TextInput
                         withAsterisk
                         label="Last name"
                         key={form.key('last_name')}
                         {...form.getInputProps('last_name')}
                    />
               </Fieldset>
               <Fieldset legend="Contact information">
                    <TextInput
                         label="Email contact"
                         placeholder="your@email.com"
                         key={form.key('contact_email')}
                         {...form.getInputProps('contact_email')}
                    />
                    <Input.Wrapper label="Phone number">
                         <Input
                              key={form.key('contact_phone')}
                              {...form.getInputProps('contact_phone')}
                              component={IMaskInput}
                              mask="+213 000 000 000"
                              placeholder="Your phone"
                         />
                    </Input.Wrapper>
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
