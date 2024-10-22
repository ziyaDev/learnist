'use client'
import SpecializationSelect from "@/components/specialises/select-input";
import UploadResume from "@/components/upload/resume";
import { createClient } from "@/supabase/lib/client";
import { useSession } from "@/supabase/lib/use-auth";
import useSupabase from "@/supabase/lib/use-supabase";
import { tanstackQueryClient } from "@/utils/provider/queries";
import { Button, Checkbox, Combobox, Fieldset, Group, Input, InputBase, Loader, Select, TagsInput, TextInput, useCombobox } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

const schema = z.object({
   name: z.string().min(2, { message: 'Name should have at least 2 letters' }),
   keywords: z.array(z.string()),
});

export default function NewLevelForm({ closeModal }: {
   closeModal?: () => void
}) {
   const form = useForm<z.infer<typeof schema>>({
      mode: 'controlled',
      validate: zodResolver(schema)
   });
   const { school } = useSession()
   const supabase = useSupabase();
   const { mutate, isPending } = useMutation({
      mutationFn: async (values: z.infer<typeof schema>) => {
         return supabase.from("levels")
            .insert({
               name: values.name,
               keywords: values.keywords,
               school_id: school?.id || "",
            })
      },
      onSuccess: async () => {
         tanstackQueryClient.invalidateQueries({ queryKey: ['levels'] })
         closeModal?.()
      },
   })

   return <form onSubmit={form.onSubmit((values) => mutate(values))}>
      <Fieldset legend="Basic information">
         <TextInput
            withAsterisk
            label="Name of the level"
            key={form.key('name')}
            {...form.getInputProps('name')}
         />

         <TagsInput
            label="Press Enter to submit a tag"
            placeholder="Enter tag"
            defaultValue={['Keyword example']}
            key={form.key('keywords')}
            {...form.getInputProps('keywords')}
            clearable
         />

      </Fieldset>




      <Group mt="md" justify="space-between" grow>
         <Button variant="default" type="button">Cancel</Button>
         <Button type="submit" loading={isPending}>Create</Button>
      </Group>

   </form>
}

