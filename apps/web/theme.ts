'use client';

import { createTheme, localStorageColorSchemeManager, MantineColorsTuple } from '@mantine/core';

const defaultColor: MantineColorsTuple = [
  '#fff4e3',
  '#ffe8ce',
  '#fdd09e',
  '#fbb669',
  '#faa03d',
  '#f99221',
  '#f98b12',
  '#de7805',
  '#c66a00',
  '#ad5a00',
];
export const theme = createTheme({
  colors: {
    defaultColor,
  },
  primaryColor: 'defaultColor',
});
export const colorSchemeManager = localStorageColorSchemeManager({
  key: 'app-color-scheme',
});