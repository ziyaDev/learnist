import { redirect } from 'next/navigation';
import Versioning from '@/actions/versioning';
import { DashboardSidebar } from '@/components/layout/dashboard/side-bar';
import OnboardingSetup from '@/components/onboarding/setup';
import PopupVersioning from '@/components/popup/dashboard/versioning';
import { createServerClient } from '@/supabase/lib/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth/login');
  }
  const profile = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (!profile.data || profile.error) return;
  return (
    <DashboardSidebar
      user={{
        full_name: profile.data.full_name,
        avatar_url: profile.data.avatar_url,
        email: user?.email || '',
      }}
    >
      <PopupVersioning opened={true} onClose={Versioning} />

      {children}
    </DashboardSidebar>
  );
}
