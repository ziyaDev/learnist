import { OnboardingLayout } from "@/components/onboarding/layout"
import { ReactNode } from "react"

export default function Layout({ children }: {
   children: ReactNode
}) {
   return <OnboardingLayout>
      {children}
   </OnboardingLayout>
}