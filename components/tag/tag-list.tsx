import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TagListProps {
  className?: string;
  tags?: string[];
  buttonVariant?: 'primary' | 'primary-contrast' | 'outlined';
}

export const TagList = ({ className, tags = [], buttonVariant = 'primary' }: TagListProps) => {
  return (
    <ul className={cn('flex gap-sm uppercase flex-wrap', className)}>
      {tags.map((tag, i) => (
        <li key={i}>
          <Button variant={buttonVariant} size="sm">{tag}</Button>
        </li>
      ))}
    </ul>
  );
}
