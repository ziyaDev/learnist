import PageHeader from "@/components/layout/dashboard/header";
import NewTeacherModal from "@/components/pages/teacher-managment/teacher/create/new-teacher-modal";
import { TeacherTable } from "@/components/pages/teacher-managment/teacher/tables/data-table";

export default function Page() {
   return <>
      <PageHeader caption="Teacher management" title="Teachers"
         primaryAction={<NewTeacherModal />}
      />
      <TeacherTable />
   </>
}