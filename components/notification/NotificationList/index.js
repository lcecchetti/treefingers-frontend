import { Text, Button } from 'components/ui';
import { InfiniteScroll } from 'components/common';
import { gql, useQuery, useMutation } from '@apollo/client';
import Notification from '../Notification';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';

export const QUERY_NOTIFICATIONS = gql`
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
      }
    }
  }
`;

const MUTATION_READ_ALL_NOTIFICATIONS = gql`
  mutation readAllNotifications {
    readAllNotifications {
      count
    }
  }
`;

const NotificationList = ({ sort = { id: 'DESC' }, first = 10 }) => {
  const { showToast } = useUI();
  const { data, loading, error, fetchMore, refetch } = useQuery(QUERY_NOTIFICATIONS, { variables: { sort, first }, fetchPolicy: 'cache-and-network'});
  const [readAllNotifications] = useMutation(MUTATION_READ_ALL_NOTIFICATIONS, {
    onCompleted(r) {
      gtag.event({
        action: 'read-all',
        category: 'notifications',
        label: 'success',
      });
      if (!r.readAllNotifications.count) {
        return;
      }
      refetch();
      showToast(`All ${r.readAllNotifications.count} notifications have been marked as read!`);
    },
    onError() {
      gtag.event({
        action: 'read-all',
        category: 'notifications',
        label: 'error',
      });
      showToast('An error has occurred!', { type: 'error' });
    }
  });
  
  return (
    <InfiniteScroll className="flex flex-col" error={error} onLoadMore={(opt) => fetchMore({ variables: { after: data?.notifications.pageInfo.endCursor }, ...opt })} loading={loading} hasMore={data?.notifications.pageInfo.hasNextPage}>
      {data &&
        <div className="flex flex-col gap-md">
          {!data?.notifications.edges.length &&
            <Text variant="h2" className="py-lg text-center">Hey, it looks like nothing new has happened ... yet!</Text>
          }

          {!!data?.notifications.edges.length &&
            <div className="flex flex-col gap-md items-center">
              <Button size="sm" onClick={() => readAllNotifications()} variant="outlined">Read all</Button>
              <ol className="flex flex-col gap-sm w-full">
                {data.notifications.edges.map(({ node }) => (
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

export default NotificationList;