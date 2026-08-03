'use client';

import { cn } from '@/lib/utils';
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
      <Component className={cn('text-3xl lg:text-5xl font-serif', className)}>
        <Link href="/">
          Treefingers
        </Link>
      </Component>
  );
};
