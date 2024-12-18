import PageHeader from '@/components/layout/dashboard/header';
import NewTeacherModal from '@/components/pages/dashboard/teacher-managment/teachers/create/new-teacher-modal';
import { TeacherTable } from '@/components/pages/dashboard/teacher-managment/teachers/tables/data-table';

export default function Page() {
  return (
    <>
      <PageHeader
        caption="Teacher management"
        title="Teachers"
        primaryAction={<NewTeacherModal />}
      />
      <TeacherTable />
    </>
  );
}
