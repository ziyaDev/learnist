'use client';

import { useSearchParams } from 'next/navigation';

const Layout = ({
  children,
  payment_history,
  assigned_students,
}: {
  children: React.ReactNode;
  payment_history: React.ReactNode;
  assigned_students: React.ReactNode;
}) => {
  const searchParams = useSearchParams();

  return (
    <>
      {children}
      {searchParams?.get('show') === 'assigned_students' ? assigned_students : payment_history}
    </>
  );
};

export default Layout;
