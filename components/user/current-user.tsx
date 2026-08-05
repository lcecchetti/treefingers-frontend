'use client';

import { CircleUserRound } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/lib/auth/current-user';
import { Text } from '@/components/ui';
import { ClientOnly } from '@/components/common/client-only';
import { QUERY_NOTIFICATIONS, notificationsVariables } from '@/components/notification';
import { useQuery } from '@apollo/client/react';

interface CurrentUserProps {
  className?: string;
}

// rendered in the Header on every page, including the static/ISR-cached
// forest, story and user routes - ClientOnly keeps the notification useQuery
// from ever running during SSR, where it would either force those routes
// dynamic or bake one visitor's badge count into the shared static cache
// (see components/common/client-only.tsx for the general mechanism)
export const CurrentUser = ({ className }: CurrentUserProps) => (
  <ClientOnly fallback={<div className={cn(className, 'relative')}><CircleUserRound className="w-6 h-6" /></div>}>
    <CurrentUserBadge className={className} />
  </ClientOnly>
);

const CurrentUserBadge = ({ className }: CurrentUserProps) => {
  const { currentUser } = useCurrentUser();

  const { data } = useQuery(QUERY_NOTIFICATIONS, {
    variables: notificationsVariables,
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    pollInterval: 60000,
    skip: !currentUser,
  });

  return (
    <div className={cn(className, 'relative')}>
      <CircleUserRound className="w-6 h-6" />
      {data?.notifications && !!data.notifications.unreadCount &&
        <Text className="bg-red bg-full rounded-full text-primary-contrast absolute left-1/2 top-1/2 text-xs p-xs w-lg h-lg text-center">
          {data.notifications.unreadCount > 99 ? '99+' : data.notifications.unreadCount}
        </Text>
      }
    </div>
  );
};
