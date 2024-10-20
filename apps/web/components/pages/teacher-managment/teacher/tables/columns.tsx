"use client"

import { DateTime } from "luxon"
import { Tables } from "@/supabase/database.types"
import { Group, Avatar, Text, Box, ActionIcon } from "@mantine/core"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumn } from "mantine-datatable"
import { IconDotsVertical, IconEye } from "@tabler/icons-react"


export const columns: DataTableColumn<Tables<'students'>>[] = [
   {
      accessor: "first_name",
      title: "Full name",
      render: (student) => {
         const full_name = student.first_name + " " + student.last_name
         return <Group gap="sm">
            <Avatar size={30} name={full_name} radius={26} color="initials" />
            <Text size="sm" fw={500}>
               {full_name}
            </Text>
         </Group>
      },
      sortable: true
   },

   {
      accessor: "contact_email",
      title: "Email",
      sortable: true
   },
   {
      accessor: "contact_phone",
      title: "Phone",
   },
   {
      accessor: "specialty",
      title: "Specialization",
      sortable: true
   },
   {
      accessor: 'date_of_hire',
      title: "Date of Hire",
      render: ({ date_of_hire }) => DateTime.fromISO(date_of_hire).toFormat('dd LLLL yyyy'),
      sortable: true
   },
   {
      accessor: 'actions',

      textAlign: 'center',
      render: (company) => (
         <ActionIcon
            size="sm"
            variant="light"
         >
            <IconDotsVertical size={16} />
         </ActionIcon>
      ),
   },
]
