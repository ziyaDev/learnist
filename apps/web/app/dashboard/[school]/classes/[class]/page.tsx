import PageHeader from '@/components/layout/dashboard/header';
import { ClassInfo } from '@/components/pages/dashboard/classes-managment/classes/class/info';
import { ClassHeader } from '@/components/pages/dashboard/classes-managment/classes/header';
import { createServerClient } from '@/supabase/lib/server';

export default async function Page({
  params,
}: {
  params: {
    school: string;
    class: string;
  };
}) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .eq('id', params.class)
    .maybeSingle();
  if (error || !data) {
    return;
  }
  return (
    <>
      <PageHeader
        title="Class details"
        caption="Class"
        backLink={`/dashboard/${params.school}}/classes`}
      />

      <ClassInfo {...data} />
      <ClassHeader />
    </>
  );
}
