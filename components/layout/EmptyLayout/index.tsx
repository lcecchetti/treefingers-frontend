import type { ReactElement, ReactNode } from 'react';

interface EmptyLayoutProps {
  children: ReactNode;
}

const EmptyLayout = ({ children }: EmptyLayoutProps): ReactElement => {
  return (
    <>
      {children}
    </>
  )
};

export default EmptyLayout;
