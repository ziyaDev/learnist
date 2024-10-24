import PageHeader from '@/components/layout/dashboard/header';
import NewPaymentModal from '@/components/pages/dashboard/subscriptions-managment/payment/create/new-payment-modal';
import { PaymentsTable } from '@/components/pages/dashboard/subscriptions-managment/payment/tables/data-table';

export default function Page() {
  return (
    <>
      <PageHeader caption="Subscriptions management" title="payments" primaryAction={<NewPaymentModal />} />
      <PaymentsTable />
    </>
  );
}
