'use client';

import { Text, Button } from '@/components/ui';
import { InfiniteScroll } from '@/components/common';
import { useQuery, useMutation } from '@apollo/client';
import { graphql } from '@/lib/graphql/generated';
import { Notification } from './notification';
import * as analytics from '@/lib/analytics';
import { useUI } from '@/lib/ui/context';

export const QUERY_NOTIFICATIONS = graphql(`
  query notifications($filter: FilterNotificationInput, $sort: SortNotificationInput, $first: Int, $after: String) {
    notifications(filter: $filter, sort: $sort, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          type
          sourceId
          targetId
          read
          createdAt
          actor {
            id
            username
          }
          content
          link
        }
      }
      pageInfo {
        endCursor
        hasNextPage
        totalCount
      }
      unreadCount
    }
  }
`);

const MUTATION_READ_ALL_NOTIFICATIONS = graphql(`
  mutation readAllNotifications {
    readAllNotifications {
      count
    }
  }
`);

export const notificationsVariables = { sort: { id: 'DESC' as const }, first: 10 };

export const NotificationList = () => {
  const { showToast } = useUI();
  const { data, loading, error, fetchMore, refetch } = useQuery(QUERY_NOTIFICATIONS, {
    variables: notificationsVariables,
    fetchPolicy: 'cache-and-network',
    pollInterval: 60000,
  });
  const [readAllNotifications] = useMutation(MUTATION_READ_ALL_NOTIFICATIONS, {
    onCompleted(r) {
      analytics.event({
        action: 'read-all',
        category: 'notifications',
        label: 'success',
      });
      if (!r.readAllNotifications?.count) {
        return;
      }
      refetch();
      showToast(`All ${r.readAllNotifications.count} notifications have been marked as read!`);
    },
    onError() {
      analytics.event({
        action: 'read-all',
        category: 'notifications',
        label: 'error',
      });
      showToast('An error has occurred!', { type: 'error' });
    }
  });

  return (
    <InfiniteScroll className="flex flex-col" error={error ?? false} onLoadMore={(opt) => fetchMore({ variables: { after: data?.notifications.pageInfo.endCursor }, ...opt })} loading={loading} hasMore={data?.notifications.pageInfo.hasNextPage}>
      {data &&
        <div className="flex flex-col gap-md">
          {!data?.notifications.edges?.length &&
            <Text variant="h2" className="py-lg text-center">Hey, it looks like nothing new has happened ... yet!</Text>
          }

          {!!data?.notifications.edges?.length &&
            <div className="flex flex-col gap-md items-center">
              {!!data.notifications.unreadCount &&
                <div className="flex gap-md justify-around items-center">
                  <Text>You have {data.notifications.unreadCount} unread notifications</Text>
                  <Button size="sm" onClick={() => readAllNotifications()} variant="outlined">Read all</Button>
                </div>
              }
              <ol className="flex flex-col gap-sm w-full">
                {data.notifications.edges?.map(({ node }) => (
                  <li key={node.id}>
                    <Notification notification={node} />
                  </li>
                ))}
              </ol>
            </div>
          }
        </div>
      }
    </InfiniteScroll>
  );
}
