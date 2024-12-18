import Link from 'next/link';
import { IconArrowBack, IconArrowLeft } from '@tabler/icons-react';
import { ActionIcon, Flex, Group, Stack, Text, Title } from '@mantine/core';

interface Props {
  title: string;
  caption: string;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  backLink?: string;
}

export default function PageHeader({
  caption,
  title,
  primaryAction,
  secondaryAction,
  backLink,
}: Props) {
  return (
    <Group justify="space-between" align="center">
      <Flex gap="md" align="center">
        {backLink && (
          <ActionIcon
            component={Link}
            href={backLink}
            variant="default"
            color="gray"
            aria-label="Back"
          >
            <IconArrowLeft size={26} />
          </ActionIcon>
        )}
        <Stack justify="center" gap="0">
          <Text size="xs" tt={'uppercase'}>
            {caption}
          </Text>
          <Title order={3}>{title}</Title>
        </Stack>
      </Flex>
      <Flex gap="md" align="center" wrap="wrap">
        {primaryAction}
        {secondaryAction}
      </Flex>
    </Group>
  );
}
