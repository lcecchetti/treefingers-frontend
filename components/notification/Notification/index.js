import clsx from 'clsx';
import { Link, Text } from 'components/ui';
import { FaEyeSlash, FaEye } from 'react-icons/fa';

const Notification = ({ notification }) => {
  return (
    <div className={clsx('border-2 rounded-lg p-md relative flex gap-md justify-between items-center',
      notification.read && 'opacity-50'
    )}>
      <Text>
        { notification.content }
      </Text>
      {notification.read ? <FaEye className="text-lg"/> : <FaEyeSlash className="text-lg"/> }
      <Link href={notification.link} className="absolute w-full h-full left-0 top-0"></Link>
    </div>
  );
}

export default Notification;