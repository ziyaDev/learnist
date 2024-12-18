import PageHeader from '@/components/layout/dashboard/header';
import NewStudentSubscriptionForm from '@/components/pages/dashboard/subscriptions-managment/payment/create/new-student-subscription-modal';
import { PaymentsTable } from '@/components/pages/dashboard/subscriptions-managment/payment/tables/data-table';

export default function Page() {
  return (
    <>
      <PageHeader
        caption="Subscriptions management"
        title="payments"
        primaryAction={<NewStudentSubscriptionForm />}
      />
      <PaymentsTable />
    </>
  );
}
