'use client';

import { UserPlus, UserCheck } from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import { graphql } from '@/lib/graphql/generated';
import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/lib/auth/current-user';
import { useState } from 'react';
import * as analytics from '@/lib/analytics';
import { useUI } from '@/lib/ui/context';

const MUTATION_FOLLOW = graphql(`
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
`);

const MUTATION_UNFOLLOW = graphql(`
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
`);

export interface UserFollowershipUser {
  id: string;
  followersCount: number;
  currentUserFollowershipAsFollower?: { id: string } | null;
}

interface UserFollowershipProps {
  user: UserFollowershipUser;
  viewOnly?: boolean;
}

export const UserFollowership = ({ user, viewOnly }: UserFollowershipProps) => {
  const { currentUser } = useCurrentUser();
  const [error, setError] = useState(false);
  const { showToast } = useUI();
  const variables = { input: { followed: user.id } }

  // mutations
  const [follow, { loading: followLoading }] = useMutation(MUTATION_FOLLOW, {
    variables,
    onCompleted: () => {
      analytics.event({
        action: 'follow',
        category: 'user',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      analytics.event({
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
      analytics.event({
        action: 'unfollow',
        category: 'user',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      analytics.event({
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
  const Icon = user.currentUserFollowershipAsFollower ? UserCheck : UserPlus;

  return (
    <div className={cn(
      'flex gap-sm items-center',
      error && 'text-error',
    )}>
      {!!user.followersCount &&
        <Text variant="span">{user.followersCount}</Text>
      }
      <Icon className={cn(
        'w-6 h-6',
        !viewOnly && 'cursor-pointer',
      )}
      onClick={toogleFollowership} />
    </div>
  );
}
