import { Center, Flex } from '@mantine/core';
import { AuthenticationForm } from '@/components/auth/login/form';

export const dynamic = 'force-dynamic';
export default function LoginPage() {
  return (
    <Flex h={'100dvh'} gap="md" justify="center" align="center" direction="row" wrap="wrap">
      <AuthenticationForm />
    </Flex>
  );
}
