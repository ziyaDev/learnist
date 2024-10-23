import PageHeader from '@/components/layout/dashboard/header';
import NewStudentModal from '@/components/pages/student-managment/students/create/new-student-modal';
import { StudentTable } from '@/components/pages/student-managment/students/tables/data-table';

export default function Page() {
  return (
    <>
      <PageHeader
        caption="Student management"
        title="Students"
        primaryAction={<NewStudentModal />}
      />
      <StudentTable />
    </>
  );
}
