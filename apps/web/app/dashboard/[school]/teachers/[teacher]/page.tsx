import PageHeader from '@/components/layout/dashboard/header';
import { TeacherHeader } from '@/components/pages/dashboard/teacher-managment/teachers/teacher/header';
import { TeacherInfo } from '@/components/pages/dashboard/teacher-managment/teachers/teacher/info';
import { createServerClient } from '@/supabase/lib/server';

export const dynamic = 'force-dynamic';

async function Page({
  params,
}: {
  params: {
    teacher: string;
    school: string;
  };
}) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('id', params.teacher)
    .maybeSingle();
  if (error || !data) {
    return;
  }
  return (
    <>
      <PageHeader
        title={'Teacher details'}
        caption="Teacher"
        backLink={`/dashboard/${params.school}/teachers`}
      />
      <TeacherInfo {...data} />
      <TeacherHeader />
    </>
  );
}
export default Page;
