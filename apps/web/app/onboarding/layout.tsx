import { ReactNode } from 'react';
import { OnboardingLayout } from '@/components/onboarding/layout';

export default function Layout({ children }: { children: ReactNode }) {
  return <OnboardingLayout>{children}</OnboardingLayout>;
}
