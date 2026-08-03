'use client';

import clsx from 'clsx';
import { Link } from '@/components/ui';
import { usePathname } from 'next/navigation';

export interface LogoProps {
  className?: string;
  main?: boolean;
}

export const Logo = ({ className, main }: LogoProps) => {
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  const Component = isHomePage && main ? 'h1' : 'span';

  return (
      <Component className={clsx('text-3xl lg:text-5xl font-serif', className)}>
        <Link href="/">
          Treefingers
        </Link>
      </Component>
  );
};
