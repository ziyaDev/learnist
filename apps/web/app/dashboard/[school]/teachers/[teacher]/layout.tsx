'use client';

import { useSearchParams } from 'next/navigation';

const Layout = ({
  children,
  payment_history,
  assigned_classes,
}: {
  children: React.ReactNode;
  payment_history: React.ReactNode;
  assigned_classes: React.ReactNode;
}) => {
  const searchParams = useSearchParams();

  return (
    <>
      {children}
      {searchParams?.get('show') === 'assigned_classes' ? assigned_classes : payment_history}
    </>
  );
};

export default Layout;
