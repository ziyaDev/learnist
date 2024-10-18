'use client'
import SpecializationSelect from "@/components/specialises/select-input";
import UploadResume from "@/components/upload/resume";
import { createClient } from "@/supabase/lib/client";
import { Button, Checkbox, Combobox, Fieldset, Group, Input, InputBase, Loader, Select, TextInput, useCombobox } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { use, useEffect, useState } from "react";
import { IMaskInput } from "react-imask";
import { useDebounceValue } from "usehooks-ts";
import { z } from "zod";

const schema = z.object({
   first_name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
   last_name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
   specialization: z.string().min(2, { message: 'specialization should have at least 2 letters' }),
   contact_email: z.string().email({ message: 'Invalid email' }).optional(),
   resume: z.array(z.string().url()).optional(),
   contact_phone: z.string().optional(),
   date_of_hire: z.date(),
});

export default function NewTeacherForm() {
   const form = useForm<z.infer<typeof schema>>({
      mode: 'controlled',
      validate: zodResolver(schema)
   });

   const [loading, setLoading] = useState(false);
   const onSubmit = async (values: z.infer<typeof schema>) => {
      const supabase = createClient();
      setLoading(true);
      const { data, error } = await supabase.from("teachers")
         .insert({
            first_name: values.first_name,
            last_name: values.last_name,
            specialty: values.specialization,
            resume_files: values.resume,
            contact_email: values.contact_email,
            contact_phone: values.contact_phone,
            date_of_hire: values.date_of_hire,

         })
      if (error) {
         console.log(error);
      }
      setLoading(false);
   }
   return <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
            <Input key={form.key('contact_phone')}
               {...form.getInputProps('contact_phone')} component={IMaskInput} mask="+213 000 000 000" placeholder="Your phone" />
         </Input.Wrapper>
      </Fieldset>
      <Fieldset legend="Job related information">
         <SpecializationSelect key={form.key('specialization')} {...form.getInputProps('specialization')} />
         <DateInput
            valueFormat="YYYY MMM DD"
            clearable
            label="Date of hire"
            defaultValue={new Date()}
            key={form.key('date_of_hire')}
            {...form.getInputProps('date_of_hire')}
            placeholder="Date input"
         />

         <UploadResume
            key={form.key('resume')}
            {...form.getInputProps('resume')}
            onUpload={(value) => form.setFieldValue('resume', [...form.getValues().resume || [], value])}
         />


      </Fieldset>



      <Group mt="md" justify="space-between" grow>
         <Button variant="default" type="button">Cancel</Button>
         <Button type="submit">Create</Button>
      </Group>

   </form>
}

