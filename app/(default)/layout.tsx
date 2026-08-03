import { Header, Footer } from '@/components/common';
import type { ReactNode } from 'react';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <div className="pt-header min-h-screen">
        {children}
      </div>
      <Footer />
    </>
  );
}
