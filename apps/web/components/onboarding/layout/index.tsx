import { ReactNode } from 'react';
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import classes from './style.module.css';

export function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <Container size={'sm'} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{' '}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="xl" p={30} mt={30} radius="md">
        {children}
      </Paper>
    </Container>
  );
}
