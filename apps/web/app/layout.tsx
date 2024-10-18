
import React from 'react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme, colorSchemeManager } from '../theme';
import { Notifications } from '@mantine/notifications';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/core/styles.css';
export const metadata = {
  title: 'Mantine Next.js template',
  description: 'I am using Mantine with Next.js!',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>

        <MantineProvider theme={theme} colorSchemeManager={colorSchemeManager} defaultColorScheme='dark'>
          <Notifications position='top-right' />
          {children}
        </MantineProvider>

      </body>
    </html>
  );
}
