import { IconHeart } from '@tabler/icons-react';
import { Card, Image, Text, Group, Badge, Button, ActionIcon, Flex } from '@mantine/core';
import classes from './style.module.css';

const mockdata = {
   image:
      '/svg/undraw_welcome_cats_thqn.svg',
   title: 'Welcome to Learinst',
   changeLog: 'New version released',
   description:
      'Learinst is your gateway to enhanced learning experiences, offering a wide range of resources and tools designed to help you succeed.',

   badges: [
      { emoji: '📚', label: 'Extensive Library' },
      { emoji: '💻', label: 'Interactive Courses' },
      { emoji: '👩‍🏫', label: 'Expert Instructors' },
      { emoji: '🌐', label: 'Global Community' },
      { emoji: '🏆', label: 'Certification Programs' },
   ],
};

export function VersioningCard({ onDimiss }: {
   onDimiss: () => void;
}) {
   const { image, title, description, changeLog, badges } = mockdata;
   const features = badges.map((badge) => (
      <Badge variant="light" key={badge.label} leftSection={badge.emoji}>
         {badge.label}
      </Badge>
   ));

   return (
      <Card withBorder radius="md" p="md" className={classes.card}>
         <Card.Section>
            <Image src={image} alt={title} height={230} />
         </Card.Section>

         <Card.Section className={classes.section} mt="md" >
            <Group justify="apart">
               <Text fz="lg" fw={500}>
                  {title}
               </Text>
               <Badge size="sm" variant="light">
                  {changeLog}
               </Badge>
            </Group>
            <Text fz="sm" mt="xs">
               {description}
            </Text>
         </Card.Section>

         <Card.Section className={classes.section}>
            <Text mt="md" className={classes.label} c="dimmed">
               New features, bugs, fixes and more
            </Text>
            <Group gap={7} mt={5}>
               {features}
            </Group>
         </Card.Section>

         <Flex mt="xs" gap='md'>
            <Button w='60%' radius="md" variant="default" >
               Remind Me Later
            </Button>
            <Button onClick={onDimiss} w={'100%'} radius="md" >
               Dismiss
            </Button>

         </Flex>
      </Card>
   );
}