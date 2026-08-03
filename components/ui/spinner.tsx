import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Text } from '@/components/ui/text';

export interface SpinnerProps {
  className?: string;
  label?: string;
  loading?: boolean;
}

export const Spinner = ({ className, label, loading = true }: SpinnerProps) => {
  if (!loading) {
    return null;
  }

  return (
    <div className={cn('flex items-center justify-around gap-sm', className)}>
      {!!label &&
        <Text variant="span">{label}</Text>
      }
      <Loader2 className="animate-spin text-2xl" />
    </div>
  );
};

