import PageHeader from '@/components/layout/dashboard/header';
import NewStudentAssignmentModal from '@/components/pages/dashboard/student-managment/students/create/new-assignment';
import NewStudentModal from '@/components/pages/dashboard/student-managment/students/create/new-student-modal';
import { StudentTable } from '@/components/pages/dashboard/student-managment/students/tables/data-table';

export default function Page() {
  return (
    <>
      <PageHeader
        caption="Student management"
        title="Students"
        primaryAction={<NewStudentModal />}
        secondaryAction={<NewStudentAssignmentModal />}
      />
      <StudentTable />
    </>
  );
}
