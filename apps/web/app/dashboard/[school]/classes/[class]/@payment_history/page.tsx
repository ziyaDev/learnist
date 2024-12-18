import { PaymentsTable } from '@/components/pages/dashboard/subscriptions-managment/payment/tables/data-table';

function Page({
  params,
}: {
  params: {
    school: string;
    class: string;
  };
}) {
  return <PaymentsTable filter_class={Number(params.class)} />;
}
export default Page;
