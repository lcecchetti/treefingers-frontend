import clsx from 'clsx';
import { Link, Text } from 'components/ui';
import { FaEyeSlash, FaEye } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';
import { getStoryUrl } from 'lib/helper/story';
import { getUserUrl } from 'lib/helper/user';
import { getForestUrl } from 'lib/helper/forest';

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

  const getLink = (notification) => {
    switch(notification.referenceType) {
      case 'STORY':
        return getStoryUrl({ id: notification.referenceId });
      case 'FOREST':
        return getForestUrl({ id: notification.referenceId });
      case 'USER':
        return getUserUrl({ id: notification.referenceId });   
    }

    return notification.link;
  }

  const getContent = (notification) => {
    switch (notification.what) {
      case 'COMMENT_STORY':
        return `${notification.who.username} commented "${notification.details?.sourceLabel}" on your story "${notification.details?.referenceLabel}"`;
      case 'COMMENT_CHAPTER':
        return `${notification.who.username} commented "${notification.details?.sourceLabel}" on your chapter "${notification.details?.referenceLabel}"`;
      case 'COMMENT_FOREST':
        return `${notification.who.username} commented "${notification.details?.sourceLabel}" on your forest "${notification.details?.referenceLabel}"`;
      case 'STORY_CREATE':
        return `${notification.who.username} planted a story "${notification.details?.sourceLabel}" in your forest "${notification.details?.referenceLabel}"`;
      case 'STORY_CONTINUE':
        return `${notification.who.username} created a chapter "${notification.details?.sourceLabel}" in your story "${notification.details?.referenceLabel}"`;
      case 'CHAPTER_CONTINUE':
        return `${notification.who.username} continued your chapter "${notification.details?.referenceLabel}"`;
      case 'LIKE_STORY':
        return `${notification.who.username} liked your story "${notification.details?.referenceLabel}"`;
      case 'LIKE_CHAPTER':
        return `${notification.who.username} liked your chapter "${notification.details?.referenceLabel}"`;
      case 'LIKE_COMMENT':
        return `${notification.who.username} liked your comment "${notification.details?.referenceLabel}"`; 
      case 'JOIN':
        return `${notification.who.username} joined your forest "${notification.details?.referenceLabel}"`;
      case 'FOLLOW':
        return `${notification.who.username} started following you`;
    }
  }

  return (
    <div className={clsx('border-2 rounded-lg p-md relative flex gap-md justify-between items-center',
        notification.read && 'opacity-50'
      )}
      onClick={() => readNotification()}
    >
      <Text>
        {getContent(notification)}
      </Text>
      {notification.read ? <FaEye className="text-lg"/> : <FaEyeSlash className="text-lg"/> }
      <Link href={getLink(notification)} className="absolute w-full h-full left-0 top-0"></Link>
    </div>
  );
}

export default Notification;