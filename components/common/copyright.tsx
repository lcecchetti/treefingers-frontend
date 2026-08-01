import { Link } from '@/components/ui';

export interface CopyrightProps {
  className?: string;
}

export const Copyright = ({ className }: CopyrightProps) => {

  return (
    <Link className={className} href="/">
      © Treefingers {new Date().getFullYear()}.
    </Link>
  );
};
