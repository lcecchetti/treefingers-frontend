'use client';

import { Link, Text } from '@/components/ui';
import { EyeOff, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMutation } from '@apollo/client/react';
import { graphql } from '@/lib/graphql/generated';
import * as analytics from '@/lib/analytics';
import { useUI } from '@/lib/ui/context';
import { formatDate, DATE_LONG } from '@/lib/helper/date';
import type { NotificationsQuery } from '@/lib/graphql/generated/graphql';

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

export const Notification = ({ notification }: NotificationProps) => {
  const { showToast } = useUI();
  const [readNotification] = useMutation(MUTATION_READ_NOTIFICATION, {
    variables: { input: { id: notification.id } },
    onCompleted() {
      analytics.event({
        action: 'read',
        category: 'notifications',
        label: 'success',
      });
    },
    onError() {
      analytics.event({
        action: 'read',
        category: 'notifications',
        label: 'error',
      });
      showToast('An error has occurred!', { type: 'error' });
    }
  });

  return (
    <div className={cn('border-2 rounded-lg p-md relative flex flex-col gap-xs',
        notification.read && 'opacity-50'
      )}
      onClick={() => { !notification.read && readNotification()}}
    >
      <div className="flex gap-md justify-between">
        <Text className="text-xs">
          {formatDate(notification.createdAt, DATE_LONG)}
        </Text>
        {notification.read ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/> }
      </div>
      <Text className="w-full">
        {notification.content}
      </Text>
      <Link href={notification.link ?? '#'} className="absolute w-full h-full left-0 top-0"></Link>
    </div>
  );
}
