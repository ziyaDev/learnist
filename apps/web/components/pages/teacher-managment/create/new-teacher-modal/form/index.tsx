'use client'
import { Button, Checkbox, Fieldset, Group, Input, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { IMaskInput } from "react-imask";
import { z } from "zod";

const schema = z.object({
   first_name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
   last_name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
   contact_email: z.string().email({ message: 'Invalid email' }).optional(),
   contact_phone: z.string().optional(),
});

export default function NewTeacherForm() {
   const form = useForm<z.infer<typeof schema>>({
      mode: 'uncontrolled',
      validate: zodResolver(schema),
   });
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
            <Input key={form.key('contact_email')}
               {...form.getInputProps('contact_email')} component={IMaskInput} mask="+213 000 000 000" placeholder="Your phone" />
         </Input.Wrapper>
      </Fieldset>

      <Group mt="md">
         <Button w={'100%'} type="submit">Create</Button>
      </Group>

   </form>
}