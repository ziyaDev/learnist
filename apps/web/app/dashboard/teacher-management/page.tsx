import PageHeader from "@/components/layout/dashboard/header";
import NewTeacherModal from "@/components/pages/teacher-managment/create/new-teacher-modal";
import { TeacherTable } from "@/components/pages/teacher-managment/teacher/tables";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

export default function Page() {
   return <>
      <PageHeader caption="Teacher management" title="Teachers"
         primaryAction={<NewTeacherModal />}
      />
      <TeacherTable />
   </>
}