import { Flex, Group, Stack, Text, Title } from '@mantine/core';

interface Props {
  title: string;
  caption: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export default function PageHeader({ caption, title, primaryAction, secondaryAction }: Props) {
  return (
    <Group justify="space-between" align="center">
      <Stack justify="center" gap="0">
        <Text size="xs" tt={'uppercase'}>
          {caption}
        </Text>
        <Title order={3}>{title}</Title>
      </Stack>
      <Flex gap="md" align="center" wrap="wrap">
        {primaryAction}
        {secondaryAction}
      </Flex>
    </Group>
  );
}
