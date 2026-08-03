import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { Button, Link } from '@/components/ui';
import { getLogoutUrl } from '@/lib/helper/auth';

interface LogoutProps {
  className?: string;
}

export const Logout = ({ className }: LogoutProps) => {
  return (
    <Button className={cn('', className)} as={Link} href={getLogoutUrl()} icon={LogOut}>
      Logout
    </Button>
  );
};
