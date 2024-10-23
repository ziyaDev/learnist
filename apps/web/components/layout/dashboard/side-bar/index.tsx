'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import {
  Icon2fa,
  IconAutomaticGearbox,
  IconBellRinging,
  IconBrandCashapp,
  IconCalendar,
  IconCalendarStats,
  IconChevronDown,
  IconDatabaseImport,
  IconFingerprint,
  IconHeart,
  IconHome,
  IconKey,
  IconLifebuoy,
  IconLogout,
  IconMessage,
  IconPlayerPause,
  IconReceipt2,
  IconReportAnalytics,
  IconSchool,
  IconSettings,
  IconStar,
  IconSwitchHorizontal,
  IconTrash,
  IconUsersGroup,
} from '@tabler/icons-react';
import cx from 'clsx';
import {
  AppShell,
  Avatar,
  Burger,
  Code,
  Group,
  Menu,
  rem,
  Skeleton,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import OnboardingSetup from '@/components/onboarding/setup';
import { Tables } from '@/supabase/database.types';
import { createClient } from '@/supabase/lib/client';
import { useSession } from '@/supabase/lib/use-auth';
import { UserButton } from '../user/button';
import { LinksGroup } from './links-group';
import classes from './style.module.css';

export const dashboard_routes = [
  { link: '', label: 'Overview', icon: IconHome },
  { link: '/teachers', label: 'Teacher management', icon: IconSchool },
  { link: '/students', label: 'Student management', icon: IconUsersGroup },
  {
    link: '/classes',
    label: 'Classes and Levels',
    icon: IconAutomaticGearbox,
    group: [
      { link: '/classes', label: 'Classes' },
      { link: '/levels', label: 'Levels' },
    ],
  },
  { link: '/subscriptions', label: 'Subscriptions', icon: IconBrandCashapp },
  { link: '/reports', label: 'Reports', icon: IconReportAnalytics },
  { link: '/communication', label: 'Communication', icon: IconMessage },
  { link: '/settings', label: 'Settings', icon: IconSettings },
];

export function DashboardSidebar({
  children,
  user,
}: {
  children: React.ReactNode;
  user: Pick<Tables<'profiles'>, 'full_name' | 'avatar_url'> & { email: string };
}) {
  const pathName = usePathname();
  const { school } = useSession();
  const [opened, { toggle }] = useDisclosure();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const theme = useMantineTheme();
  const links = dashboard_routes.map((item) => {
    if (item.group) {
      return (
        <LinksGroup
          {...item}
          key={item.label}
          links={item.group.map((link) => ({
            label: link.label,
            link: `/dashboard/${school.id}` + link.link,
            active: pathName === `/dashboard/${school.id}` + link.link,
          }))}
          initiallyOpened={
            item.group.some((s) => pathName === `/dashboard/${school.id}` + s.link) || undefined
          }
        />
      );
    }
    return (
      <Link
        className={classes.link}
        data-active={pathName === `/dashboard/${school.id}` + item.link || undefined}
        href={`/dashboard/${school.id}` + item.link}
        key={item.label}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </Link>
    );
  });

  return (
    <>
      <AppShell
        header={{ height: { base: 60, md: 60, lg: 60 } }}
        navbar={{
          width: { md: 300, lg: 300 },
          breakpoint: 'md',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" w={'100%'} justify="space-between">
            <Group h="100%" px="md">
              <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
              <Group h="100%" px="md" justify="space-between">
                <MantineLogo size={28} />
                <Code fw={700}>v0.1</Code>
              </Group>
            </Group>
            <Menu
              width={300}
              position="bottom-end"
              transitionProps={{ transition: 'pop' }}
              onClose={() => setUserMenuOpened(false)}
              onOpen={() => setUserMenuOpened(true)}
              withinPortal
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                >
                  <Group gap={4}>
                    <Avatar
                      src={user.avatar_url}
                      alt={user.full_name || 'profile-picture'}
                      radius="xl"
                      size={'sm'}
                    />

                    <Stack justify="end" gap="2">
                      <Text c="dimmed" size="xs" visibleFrom="md">
                        {user.email}
                      </Text>
                    </Stack>
                    <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Settings</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                >
                  Account settings
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconSwitchHorizontal
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                >
                  Change school
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                >
                  Logout
                </Menu.Item>

                <Menu.Divider />

                <Menu.Label>Danger zone</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconPlayerPause style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                >
                  Pause subscription
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={
                    <IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                  }
                >
                  Delete account
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <div className={classes.navbarMain}>{links}</div>

          <div className={classes.footer}>
            <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
              <IconLifebuoy className={classes.linkIcon} stroke={1.5} />
              <span>Help & support</span>
            </a>
            <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
              <IconLogout className={classes.linkIcon} stroke={1.5} />
              <span>Logout</span>
            </a>
          </div>
        </AppShell.Navbar>
        <AppShell.Main>
          <Stack gap="md" p={'md'}>
            {children}
          </Stack>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
