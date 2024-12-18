import AssignedStudentsDataTable from '@/components/pages/dashboard/classes-managment/classes/tables/assigned_students/data-table';

export default function Page({ params }: { params: { class: string } }) {
  return <AssignedStudentsDataTable class_id={Number(params.class)} />;
}
