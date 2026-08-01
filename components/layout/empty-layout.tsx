import type { ReactElement, ReactNode } from 'react';

interface EmptyLayoutProps {
  children: ReactNode;
}

export const EmptyLayout = ({ children }: EmptyLayoutProps): ReactElement => {
  return (
    <>
      {children}
    </>
  )
};
