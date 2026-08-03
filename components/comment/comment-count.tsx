'use client';

import { FaRegComment } from 'react-icons/fa';
import { Text } from '@/components/ui';
import clsx from 'clsx';

interface CommentCountProps {
  count: number;
  action?: () => void;
}

export const CommentCount = ({ count, action }: CommentCountProps) => {

  return (
    <div className="flex items-center gap-sm">
      {!!count &&
        <Text variant="span">{count}</Text>
      }
      <FaRegComment className={clsx(
        'text-2xl',
        !!action && 'cursor-pointer'
      )} onClick={action} />
    </div>
  );
}
