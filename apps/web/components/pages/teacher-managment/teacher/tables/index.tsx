'use client'
import cx from 'clsx';
import { useState } from 'react';
import { Table, Checkbox, ScrollArea, Group, Avatar, Text, rem, Card, Pagination, Flex, Divider, TextInput, Button, Select } from '@mantine/core';
import classes from './style.module.css';
import { IconFilter, IconSearch, IconSortAscending } from '@tabler/icons-react';

const data = [
   {
      id: '1',
      name: 'Robert Wolfkisser',
      job: 'Engineer',
      email: 'rob_wolf@gmail.com',
   },
   {
      id: '2',

      name: 'Jill Jailbreaker',
      job: 'Engineer',
      email: 'jj@breaker.com',
   },
   {
      id: '3',

      name: 'Henry Silkeater',
      job: 'Designer',
      email: 'henry@silkeater.io',
   },
   {
      id: '4',

      name: 'Bill Horsefighter',
      job: 'Designer',
      email: 'bhorsefighter@gmail.com',
   },
   {
      id: '5',

      name: 'Jeremy Footviewer',
      job: 'Manager',
      email: 'jeremy@foot.dev',
   },
];

export function TeacherTable() {
   const [selection, setSelection] = useState(['1']);
   const toggleRow = (id: string) =>
      setSelection((current) =>
         current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      );
   const toggleAll = () =>
      setSelection((current) => (current.length === data.length ? [] : data.map((item) => item.id)));

   const rows = data.map((item) => {
      const selected = selection.includes(item.id);
      return (
         <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
            <Table.Td>
               <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
            </Table.Td>
            <Table.Td>
               <Group gap="sm">
                  <Avatar size={30} name={item.name} radius={26} color="initials" />
                  <Text size="sm" fw={500}>
                     {item.name}
                  </Text>
               </Group>
            </Table.Td>
            <Table.Td>{item.email}</Table.Td>
            <Table.Td>{item.job}</Table.Td>
         </Table.Tr>
      );
   });
   const s = <Pagination total={10} color="orange" size="sm" />

   return (
      <Card withBorder radius="md" p="md" className={classes.card} >

         <ScrollArea>
            <Flex justify={'space-between'} align={'center'} w='100%' >
               <Group gap={'md'}>
                  <TextInput
                     w={{
                        base: "4rem",
                        md: "8rem",
                        lg: "22rem",
                     }}
                     placeholder="Search by any field"
                     leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                     value={""}
                     onChange={() => { }}
                  />

               </Group>
               <Group gap={'md'}>
                  <Select
                     w={{
                        base: "4rem",
                        md: "8rem",
                        lg: "20rem",
                     }}
                     checkIconPosition="right"
                     placeholder="Grouped by"
                     data={[
                        { group: 'Frontend', items: ['React', 'Angular'] },
                        { group: 'Backend', items: ['Express', 'Django'] },
                     ]}
                     maxDropdownHeight={300}
                     searchable
                  />
                  <Button variant='light' leftSection={<IconFilter style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
                     Filter
                  </Button>
                  <Button variant='light' leftSection={<IconSortAscending style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}>
                     Sort
                  </Button>
               </Group>

            </Flex>
            <Table captionSide="bottom" miw={800} verticalSpacing="sm" striped highlightOnHover >
               <Table.Thead>
                  <Table.Tr>
                     <Table.Th style={{ width: rem(40) }}>
                        <Checkbox
                           onChange={toggleAll}
                           checked={selection.length === data.length}
                           indeterminate={selection.length > 0 && selection.length !== data.length}
                        />
                     </Table.Th>
                     <Table.Th>User</Table.Th>
                     <Table.Th>Email</Table.Th>
                     <Table.Th>Job</Table.Th>
                  </Table.Tr>
               </Table.Thead>
               <Table.Tbody>{rows}</Table.Tbody>
            </Table>

         </ScrollArea>
         <Card.Section withBorder inheritPadding py="md">
            <Group justify="space-between" align={'center'} w='100%' >
               <Text size='md' c='dimmed'>
                  Showing 1 to 8 of 16 entries
               </Text>
               <Pagination total={3} color="orange" size="md" />
            </Group>
         </Card.Section>
      </Card>
   );
}