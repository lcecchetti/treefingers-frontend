import { FaUserCircle } from 'react-icons/fa';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';
import { Text } from 'components/ui';
import { QUERY_NOTIFICATIONS, notificationsVariables } from 'components/notification';
import { useQuery } from '@apollo/client';

const CurrentUser = ({ className }) => {
  const { currentUser } = useCurrentUser();

  const { data } = useQuery(QUERY_NOTIFICATIONS, { 
    variables: notificationsVariables,
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    pollInterval: 60000,
    skip: !currentUser,
  });

  return (
    <div className={clsx(className, 'relative')}>
      <FaUserCircle/>
      {data?.notifications && !!data.notifications.unreadCount &&
        <Text className="bg-red bg-full rounded-full text-primary-contrast absolute left-1/2 top-1/2 text-xs p-xs w-lg h-lg text-center">
          {data.notifications.unreadCount > 99 ? '99+' : data.notifications.unreadCount}
        </Text>
      }
    </div>
  );
};

export default CurrentUser;