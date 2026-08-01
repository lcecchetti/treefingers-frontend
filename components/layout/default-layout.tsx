import { Header, Footer } from '@/components/common';
import type { ReactElement, ReactNode } from 'react';

interface DefaultLayoutProps {
  children: ReactNode;
}

export const DefaultLayout = ({ children }: DefaultLayoutProps): ReactElement => {
  return (
    <>
      <Header/>
      <div className="pt-header min-h-screen">
        {children}
      </div>
      <Footer/>
    </>
  )
};
