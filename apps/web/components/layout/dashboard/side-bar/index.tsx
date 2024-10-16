'use client'
import { useEffect, useState } from 'react';
import cx from 'clsx';
import { User } from '@supabase/supabase-js';
import {
    Group, Code, AppShell, Burger, Skeleton, rem,
    useMantineTheme, Text, Avatar, Menu, UnstyledButton,
    Stack
} from '@mantine/core';
import {
    IconBellRinging,
    IconFingerprint,
    IconKey,
    IconSettings,
    Icon2fa,
    IconDatabaseImport,
    IconReceipt2,
    IconSwitchHorizontal,
    IconLifebuoy, IconHome,
    IconUsersGroup,
    IconSchool,
    IconLogout,
    IconHeart,
    IconStar,
    IconPlayerPause,
    IconTrash,

    IconChevronDown,
    IconCalendar,
    IconBrandCashapp, IconReportAnalytics,
    IconMessage,
    IconAutomaticGearbox

} from '@tabler/icons-react';
import classes from './style.module.css';
import { UserButton } from '../user/button';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import { createClient } from '@/supabase/lib/client';
import { Tables } from '@/supabase/database.types';
import OnboardingSetup from '@/components/onboarding/setup';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const data = [
    { link: '/dashboard', label: 'Overview', icon: IconHome },
    { link: '/dashboard/teacher-management', label: 'Teacher management', icon: IconSchool },
    { link: '', label: 'Student management', icon: IconUsersGroup },
    { link: '', label: 'Classes and Levels', icon: IconAutomaticGearbox },
    { link: '', label: 'Scheduling', icon: IconCalendar },
    { link: '', label: 'Subscriptions', icon: IconBrandCashapp },
    { link: '', label: 'Reports', icon: IconReportAnalytics },
    { link: '', label: 'Communication', icon: IconMessage },
    { link: '', label: 'Settings', icon: IconSettings },
];

export function DashboardSidebar({ children, user }: {
    children: React.ReactNode;
    user: Pick<Tables<"profiles">, 'full_name' | 'avatar_url'> & { email: string };
}) {
    const pathName = usePathname();
    const [opened, { toggle }] = useDisclosure();
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const theme = useMantineTheme();
    const links = data.map((item) => (
        <Link
            className={classes.link}
            data-active={item.link === pathName || undefined}
            href={item.link}
            key={item.label}
        >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </Link>
    ));

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
                    <Group h="100%" w={"100%"} justify="space-between">
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
                            transitionProps={{ transition: "pop" }}
                            onClose={() => setUserMenuOpened(false)}
                            onOpen={() => setUserMenuOpened(true)}
                            withinPortal

                        >
                            <Menu.Target>
                                <UnstyledButton
                                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                                >
                                    <Group gap={4}>
                                        <Avatar src={user.avatar_url} alt={user.full_name || "profile-picture"} radius="xl" size={"sm"} />

                                        <Stack
                                            justify='end'
                                            gap="2"
                                        >



                                            <Text c="dimmed" size="xs" visibleFrom="md">
                                                {user.email}
                                            </Text>
                                        </Stack>
                                        <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                                    </Group>
                                </UnstyledButton>
                            </Menu.Target>
                            <Menu.Dropdown >
                                <Menu.Item
                                    leftSection={
                                        <IconHeart
                                            style={{ width: rem(16), height: rem(16) }}
                                            color={theme.colors.red[6]}
                                            stroke={1.5}
                                        />
                                    }
                                >
                                    Liked posts
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={
                                        <IconStar
                                            style={{ width: rem(16), height: rem(16) }}
                                            color={theme.colors.yellow[6]}
                                            stroke={1.5}
                                        />
                                    }
                                >
                                    Saved posts
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={
                                        <IconMessage
                                            style={{ width: rem(16), height: rem(16) }}
                                            color={theme.colors.blue[6]}
                                            stroke={1.5}
                                        />
                                    }
                                >
                                    Your comments
                                </Menu.Item>

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
                                        <IconSwitchHorizontal style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                                    }
                                >
                                    Change account
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
                                    leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                                >
                                    Delete account
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar p="md">
                    <div className={classes.navbarMain}>

                        {links}
                    </div>

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
                    <Stack
                        gap="md"
                        p={'md'}
                    >
                        {children}
                    </Stack>
                </AppShell.Main>
            </AppShell>
        </>
    );
}