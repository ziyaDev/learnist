import React, { PropsWithChildren } from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { colorSchemeManager, theme } from '../theme';

import '@mantine/dropzone/styles.layer.css';
import '@mantine/notifications/styles.layer.css';
import '@mantine/dates/styles.layer.css';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import './globals.css';

import QueriesProvider from '@/utils/provider/queries';

export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider
          theme={theme}
          colorSchemeManager={colorSchemeManager}
          defaultColorScheme="auto"
        >
          <QueriesProvider>
            <Notifications position="top-right" />
            {children}
          </QueriesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
