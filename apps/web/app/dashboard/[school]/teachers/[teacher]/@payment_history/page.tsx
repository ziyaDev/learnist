import { PaymentsTable } from '@/components/pages/dashboard/subscriptions-managment/payment/tables/data-table';

function Page({
  params,
}: {
  params: {
    student: string;
    school: string;
  };
}) {
  return <PaymentsTable />;
}
export default Page;
