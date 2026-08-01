import clsx from 'clsx';
import { CgSpinner } from 'react-icons/cg';
import { Text } from '@/components/ui/text';

export interface SpinnerProps {
  className?: string;
  label?: string;
  loading?: boolean;
}

export const Spinner = ({ className, label, loading = true }: SpinnerProps) => {

  if (!loading) {
    return '';
  }

  return (
    <div className={clsx('flex items-center justify-around gap-sm', className)}>
      {!!label &&
        <Text variant="span">{label}</Text>
      }
      <CgSpinner className="animate-spin text-2xl" />
    </div>
  );
};

