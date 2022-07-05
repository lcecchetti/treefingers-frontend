import clsx from 'clsx';
import { Link, Text } from 'components/ui';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';

const MUTATION_READ_NOTIFICATION = gql`
  mutation readNotification($input: ReadNotificationInput!) {
    readNotification(input: $input) {
      notification {
        id
        read
      }
    }
  }
`;

const Notification = ({ notification }) => {
  const { showToast } = useUI();
  const [readNotification] = useMutation(MUTATION_READ_NOTIFICATION, {
    variables: { input: { id: notification.id } },
    onCompleted() {
      gtag.event({
        action: 'read',
        category: 'notifications',
        label: 'success',
      });
    },
    onError() {
      gtag.event({
        action: 'read',
        category: 'notifications',
        label: 'error',
      });
      showToast('An error has occurred!', { type: 'error' });
    }
  });

  return (
    <div className={clsx('border-2 rounded-lg p-md relative flex gap-md justify-between items-center',
        notification.read && 'opacity-50'
      )}
      onClick={() => readNotification()}
    >
      <Text>
        { notification.content }
      </Text>
      {notification.read ? <FaEye className="text-lg"/> : <FaEyeSlash className="text-lg"/> }
      <Link href={notification.link} className="absolute w-full h-full left-0 top-0"></Link>
    </div>
  );
}

export default Notification;