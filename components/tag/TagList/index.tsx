import { Button } from 'components/ui';
import clsx from 'clsx';

interface TagListProps {
  className?: string;
  tags?: string[];
  buttonVariant?: 'primary' | 'primary-contrast' | 'outlined';
}

const TagList = ({ className, tags = [], buttonVariant = 'primary' }: TagListProps) => {
  return (
    <ul className={clsx('flex gap-sm uppercase flex-wrap', className)}>
      {tags.map((tag, i) => (
        <li key={i}>
          <Button variant={buttonVariant} size="sm">{tag}</Button>
        </li>
      ))}
    </ul>
  );
}

export default TagList;
