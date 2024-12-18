import AssignedClassesDataTable from '@/components/pages/dashboard/student-managment/students/tables/assigned_classes/data-table';

export default function Page({ params }: { params: { student: string } }) {
  return <AssignedClassesDataTable student_id={Number(params.student)} />;
}
