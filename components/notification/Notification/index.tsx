import clsx from 'clsx';
import { Link, Text } from 'components/ui';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';
import { formatDate, DATE_LONG } from 'lib/helper/date';
import type { NotificationsQuery } from 'lib/graphql/generated/graphql';

const MUTATION_READ_NOTIFICATION = graphql(`
  mutation readNotification($input: ReadNotificationInput!) {
    readNotification(input: $input) {
      notification {
        id
        read
      }
    }
  }
`);

type NotificationNode = NonNullable<NotificationsQuery['notifications']['edges']>[number]['node'];

interface NotificationProps {
  notification: NotificationNode;
}

const Notification = ({ notification }: NotificationProps) => {
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
    <div className={clsx('border-2 rounded-lg p-md relative flex flex-col gap-xs',
        notification.read && 'opacity-50'
      )}
      onClick={() => { !notification.read && readNotification()}}
    >
      <div className="flex gap-md justify-between">
        <Text className="text-xs">
          {formatDate(notification.createdAt, DATE_LONG)}
        </Text>
        {notification.read ? <FaEye className="text-lg"/> : <FaEyeSlash className="text-lg"/> }
      </div>
      <Text className="w-full">
        {notification.content}
      </Text>
      <Link href={notification.link ?? '#'} className="absolute w-full h-full left-0 top-0"></Link>
    </div>
  );
}

export default Notification;
