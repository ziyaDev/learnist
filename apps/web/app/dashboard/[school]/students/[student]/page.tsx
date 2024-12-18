import { IconBook, IconHistory } from '@tabler/icons-react';
import { Button, SimpleGrid, Tabs } from '@mantine/core';
import PageHeader from '@/components/layout/dashboard/header';
import NewStudentAssignmentModal from '@/components/pages/dashboard/student-managment/students/create/new-assignment';
import { StudentHeader } from '@/components/pages/dashboard/student-managment/students/student/header';
import { StudentInfo } from '@/components/pages/dashboard/student-managment/students/student/info';
import { PaymentsTable } from '@/components/pages/dashboard/subscriptions-managment/payment/tables/data-table';
import { createServerClient } from '@/supabase/lib/server';

export const dynamic = 'force-dynamic';

async function Page({
  params,
}: {
  params: {
    student: string;
    school: string;
  };
}) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', params.student)
    .maybeSingle();
  if (error || !data) {
    return;
  }
  return (
    <>
      <PageHeader
        title={'Student details'}
        caption="Student"
        backLink={`/dashboard/${params.school}/students`}
        secondaryAction={<NewStudentAssignmentModal />}
      />
      <StudentInfo {...data} />
      <StudentHeader />
    </>
  );
}
export default Page;
