import PageHeader from "@/components/layout/dashboard/header";
import NewClassModal from "@/components/pages/classes-managment/classes/create/new-class-modal";
import { ClassesTable } from "@/components/pages/classes-managment/classes/tables/data-table";

export default function Page() {
   return <>
      <PageHeader caption="Classes management" title="Classes"
         primaryAction={<NewClassModal />}
      />
      <ClassesTable />

   </>
}