import { redirect } from 'next/navigation';
import { IconDownload, IconPlus } from '@tabler/icons-react';
import { Button } from '@mantine/core';
import { StatsGrid } from '@/components/analytics/cards/states/grid';
import PageHeader from '@/components/layout/dashboard/header';
import { createServerClient } from '@/supabase/lib/server';

export default async function Index() {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <>
      <PageHeader
        caption="Overview"
        title="Dashboard"
        primaryAction={
          <Button variant="default" leftSection={<IconDownload size={18} />}>
            Download report
          </Button>
        }
        secondaryAction={<Button leftSection={<IconPlus size={18} />}>Create new report</Button>}
      />
      <StatsGrid />
    </>
  );
}
