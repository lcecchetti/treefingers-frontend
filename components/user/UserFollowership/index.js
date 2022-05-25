import { FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import { Text } from 'components/ui';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';
import { useState } from 'react';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';

const MUTATION_FOLLOW = gql`
  mutation follow($input: FollowInput!) {
    follow(input: $input) {
      followership {
        id
        followed {
          id
          followersCount
          currentUserFollowershipAsFollower {
            id
          }
        }
      } 
    }
  }
`;

const MUTATION_UNFOLLOW = gql`
  mutation unfollow($input: UnfollowInput!) {
    unfollow(input: $input) {
      followership {
        id
        followed {
          id
          followersCount
          currentUserFollowershipAsFollower {
            id
          }
        }
      } 
    }
  }
`;

const UserFollowership = ({ user, viewOnly }) => {
  const { currentUser } = useCurrentUser();
  const [error, setError] = useState(false);
  const { showToast } = useUI();
  const variables = { input: { followed: user.id } }

  // mutations
  const [follow, { loading: followLoading }] = useMutation(MUTATION_FOLLOW, {
    variables,
    onCompleted: () => {
      gtag.event({
        action: 'follow',
        category: 'user',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      gtag.event({
        action: 'follow',
        category: 'user',
        label: 'error',
      });
      setError(true);
    }
  });
  const [unfollow, { loading: unfollowLoading }] = useMutation(MUTATION_UNFOLLOW, {
    variables,
    onCompleted: () => {
      gtag.event({
        action: 'unfollow',
        category: 'user',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      gtag.event({
        action: 'unfollow',
        category: 'user',
        label: 'error',
      });
      setError(true);
    },
  });

  const isSubmitting = followLoading || unfollowLoading;

  const toogleFollowership = async () => {
    if (viewOnly || isSubmitting) {
      // block submission
      return;
    }

    if (!currentUser) {
      showToast('You need to be logged in to follow.');
      return;
    }

    user.currentUserFollowershipAsFollower ? await unfollow() : await follow();
  }

  // pick icon accoridng to user followership
  const Icon = user.currentUserFollowershipAsFollower ? FaUserCheck : FaUserPlus;

  return (
    <div className={clsx(
      'flex gap-sm items-center',
      error && 'text-error',
    )}>
      {!!user.followersCount &&
        <Text variant="span">{user.followersCount}</Text>
      }
      <Icon className={clsx(
        'text-2xl',
        !viewOnly && 'cursor-pointer',
      )} 
      onClick={toogleFollowership} />
    </div>
  );
}

export default UserFollowership;