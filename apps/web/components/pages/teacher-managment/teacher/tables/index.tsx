'use client'
import cx from 'clsx';
import { useState } from 'react';
import { Table, Checkbox, ScrollArea, Group, Avatar, Text, rem, Card, Pagination, Flex, Divider, TextInput, Button, Select } from '@mantine/core';
import classes from './style.module.css';
import { IconFilter, IconSearch, IconSortAscending } from '@tabler/icons-react';
import { spec } from 'node:test/reporters';

const data = [
   {
      id: '1',
      name: 'Robert Wolfkisser',
      phone: '+91 987654321',
      specialization: 'Web Development',
      date_of_hire: '22 Feb 2023',
      email: 'rob_wolf@gmail.com',
   },
   {
      id: '2',
      name: 'Jill Jailbreaker',
      phone: '+91 987654321',
      specialization: 'Web Development',
      date_of_hire: '22 Feb 2023',
      email: 'jj@breaker.com',
   },
   {
      id: '3',

      name: 'Henry Silkeater',
      phone: '+91 987654321',
      specialization: 'Web Development',
      date_of_hire: '22 Feb 2023',
      email: 'henry@silkeater.io',
   },
   {
      id: '4',

      name: 'Bill Horsefighter',
      phone: '+91 987654321',
      specialization: 'Web Development',
      date_of_hire: '22 Feb 2023',
      email: 'bhorsefighter@gmail.com',
   },
   {
      id: '5',

      name: 'Jeremy Footviewer',
      phone: '+91 987654321',
      specialization: 'Web Development',
      date_of_hire: '22 Feb 2023',
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
            <Table.Td>{item.phone}</Table.Td>
            <Table.Td>{item.specialization}</Table.Td>
            <Table.Td>{item.date_of_hire}</Table.Td>
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
                     <Table.Th>Full name</Table.Th>
                     <Table.Th>Email</Table.Th>
                     <Table.Th>Phone</Table.Th>
                     <Table.Th>Specialization</Table.Th>
                     <Table.Th>Date of Hire</Table.Th>
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