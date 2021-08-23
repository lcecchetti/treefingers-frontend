import { FaRegComment } from 'react-icons/fa';
import { Text } from 'components/ui';
import clsx from 'clsx';

const CommentCount = ({ count, action }) => {

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

export default CommentCount;