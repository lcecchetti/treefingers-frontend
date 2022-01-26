import { Button } from 'components/ui';
import clsx from 'clsx';

const TagList = ({ className, tags = [], buttonVariant = 'primary' }) => {
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