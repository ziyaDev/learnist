import PageHeader from '@/components/layout/dashboard/header';
import NewLevelModal from '@/components/pages/dashboard/levels-managment/levels/create/new-level-modal';
import { LevelsTable } from '@/components/pages/dashboard/levels-managment/levels/tables/data-table';

export default function Page() {
  return (
    <>
      <PageHeader caption="Levels management" title="Levels" primaryAction={<NewLevelModal />} />
      <LevelsTable />
    </>
  );
}
