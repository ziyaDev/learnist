"use client"

import { DateTime } from "luxon"
import { Tables } from "@/supabase/database.types"
import { Group, Avatar, Text, Box, ActionIcon } from "@mantine/core"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumn } from "mantine-datatable"
import { IconDotsVertical, IconEye } from "@tabler/icons-react"


export const columns: DataTableColumn<Tables<'classes'>>[] = [
   {
      accessor: "name",
      title: "Name",
      sortable: true
   },
   {
      accessor: 'created_at',
      title: "Classes ",
      render: ({ created_at }) => 20,
      sortable: true
   },
   {
      accessor: 'created_at',
      title: "Teachers ",
      render: ({ created_at }) => 20,
      sortable: true
   },
   {
      accessor: 'created_at',
      title: "Students ",
      render: ({ created_at }) => 20,
      sortable: true
   },
   {
      accessor: 'created_at',
      title: "Created at",
      render: ({ created_at }) => DateTime.fromISO(created_at).toFormat('dd LLLL yyyy'),
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
