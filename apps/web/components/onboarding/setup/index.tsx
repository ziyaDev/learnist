'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IMaskInput } from 'react-imask';
import { z } from 'zod';
import {
  Button,
  ColorPicker,
  DEFAULT_THEME,
  Fieldset,
  Flex,
  Grid,
  Group,
  Input,
  Modal,
  MultiSelect,
  Radio,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { createFormContext, useForm, zodResolver } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import UploadAvatar from '@/components/upload/avatar';
import { createClient } from '@/supabase/lib/client';
import classes from './style.module.css';

const positions = ['Manager', 'Administrator', 'School owner', 'Worker'] as const;
const socials = [
  'Facebook',
  'Instagram',
  'Google',
  'Youtube',
  'Whatsapp',
  'Just a friend',
] as const;
type OnboardingSetupContextProps = {
  school_id?: string;
  setSchoolId: (school_id: string) => void;
};
const OnboardingSetupContext = createContext<OnboardingSetupContextProps | null>(null);

const useOnboardingSetup = () => {
  const context = useContext(OnboardingSetupContext);
  if (!context) throw new Error('useOnboardingSetup must be used within OnboardingSetupContext');
  return context;
};

export default function OnboardingSetup() {
  const [step, setStep] = useState<1 | 2>(1);
  const [school_id, setSchoolId] = useState<string>();
  const handleNextStep = useCallback(() => {
    if (step == 1) setStep(2);
    if (step == 2) setStep(2);
  }, [step]);
  const stepper = () => {
    switch (step) {
      case 1:
        return <Step1 onSubmit={handleNextStep} />;
      case 2:
        return <Step2 onSubmit={handleNextStep} />;
      default:
        return <Step1 onSubmit={handleNextStep} />;
    }
  };
  return (
    <OnboardingSetupContext.Provider
      value={{
        school_id,
        setSchoolId,
      }}
    >
      <Flex gap={'sm'} direction={'column'}>
        {stepper()}
      </Flex>
    </OnboardingSetupContext.Provider>
  );
}

const Step1 = ({ onSubmit }: { onSubmit: () => void }) => {
  const schema = z.object({
    name: z.string().min(3, { message: 'Name should have at least 3 letters' }),
    email: z.string().email({ message: 'Invalid email' }),
    avatar: z.string().url(),
    phone_number: z.string().optional(),
    full_address: z.string().optional(),
    additional_info: z.string().optional(),
  });
  const { setSchoolId } = useOnboardingSetup();
  const form = useForm({
    mode: 'controlled',
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });
  const supabase = createClient();
  const [isMutating, setIsMutating] = useState(false);
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        setIsMutating(true);
        await supabase
          .from('schools')
          .insert({
            name: form.values.name,
            contact_number: form.values.phone_number,
            contact_email: form.values.email,
            logo_url: form.values.avatar,
            address: form.values.additional_info,
          })
          .select('id')
          .single()
          .then(({ data, error }) => {
            if (error) {
              notifications.show({
                title: 'Default notification',
                message: 'Do not forget to star Mantine on GitHub! 🌟',
              });
              return;
            }
            data && setSchoolId(data?.id);
          });
        onSubmit();
      } catch (error) {
        console.error('Error inserting data:', error);
      } finally {
        setIsMutating(false);
      }
    },
    [form]
  );
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Fieldset legend="Basic information">
          <Flex gap={'sm'} w={'100%'} align={'end'}>
            <UploadAvatar key={form.key('avatar')} {...form.getInputProps('avatar')} />
            <TextInput
              key={form.key('name')}
              {...form.getInputProps('name')}
              w={'100%'}
              label="Name"
              placeholder="What's the name of your school"
            />
          </Flex>
        </Fieldset>
        <Fieldset legend="Contact information">
          <Input
            w={'100%'}
            label="Phone number"
            key={form.key('phone_number')}
            {...form.getInputProps('phone_number')}
            component={IMaskInput}
            mask="+213 000 000 000"
            placeholder="Your phone"
          />
          <TextInput
            w={'100%'}
            key={form.key('email')}
            {...form.getInputProps('email')}
            label="Email address"
            placeholder="example@example.com"
          />
        </Fieldset>
        <Fieldset legend="More optional details">
          <TextInput
            w={'100%'}
            label="Full address"
            placeholder="Where your school is located"
            key={form.key('address')}
            {...form.getInputProps('address')}
          />
          <Textarea
            w={'100%'}
            label="Additional info"
            placeholder="Give your school a short description"
            key={form.key('additional_info')}
            {...form.getInputProps('additional_info')}
          />
        </Fieldset>
        <Button w={'100%'} loading={isMutating} mt="xs" disabled={!form.isValid()} type="submit">
          Continue
        </Button>
      </form>
    </>
  );
};
const Step2 = ({ onSubmit }: { onSubmit: () => void }) => {
  const schema = z.object({
    team_count: z.string().min(4, { message: 'please select one' }),
    position: z.string(z.enum(positions)),
    where_did_u_find_us: z.string(z.enum(socials)),
  });
  const router = useRouter();
  const { school_id } = useOnboardingSetup();
  const form = useForm({
    mode: 'controlled',
    validate: zodResolver(schema),
    validateInputOnBlur: true,
  });
  const [isMutating, setIsMutating] = useState(false);
  const supabase = createClient();
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsMutating(true);
      try {
        if (!school_id) return;
        const { data, error } = await supabase.from('informations').insert({
          position: form.values.position,
          where_did_u_find_us: form.values.where_did_u_find_us,
          team_size: form.values.team_count,
          school_id: school_id,
        });
        if (error) {
          notifications.show({
            title: 'Default notification',
            message: 'Do not forget to star Mantine on GitHub! 🌟',
          });
          return;
        }
        router.push('/dashboard');
        onSubmit();
      } catch (error) {
        console.error('Error inserting data:', error);
      }
    },
    [form]
  );
  return (
    <form onSubmit={handleSubmit}>
      <Fieldset legend="About you">
        <Select
          checkIconPosition="right"
          label="What is your position"
          placeholder="Select your role"
          data={positions}
          key={form.key('position')}
          {...form.getInputProps('position')}
        />
        <Select
          checkIconPosition="right"
          label="How big is your team"
          placeholder="Select your role"
          key={form.key('team_count')}
          {...form.getInputProps('team_count')}
          data={['1-5 people', '5-10 people', '10-20 people', 'More than 20']}
        />
      </Fieldset>
      <Fieldset legend="Help us improve">
        <Select
          label="Where did you find us"
          checkIconPosition="right"
          data={socials}
          key={form.key('where_did_u_find_us')}
          {...form.getInputProps('where_did_u_find_us')}
        />
      </Fieldset>
      <Button w={'100%'} loading={isMutating} mt="xs" disabled={!form.isValid()} type="submit">
        Continue
      </Button>
    </form>
  );
};
