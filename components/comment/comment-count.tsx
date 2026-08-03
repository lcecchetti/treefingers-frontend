'use client';

import { MessageSquare } from 'lucide-react';
import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';

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
      <MessageSquare className={cn(
        'w-6 h-6',
        !!action && 'cursor-pointer'
      )} onClick={action} />
    </div>
  );
}
