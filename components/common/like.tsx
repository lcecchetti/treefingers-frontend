'use client';

import { Heart } from 'lucide-react';
import { useMutation } from '@apollo/client/react';
import { graphql } from '@/lib/graphql/generated';
import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useCurrentUser } from '@/lib/auth/current-user';
import { useState } from 'react';
import * as analytics from '@/lib/analytics';
import { useUI } from '@/lib/ui/context';

const MUTATION_LIKE = graphql(`
  mutation like($input: LikeInput!) {
    like(input: $input) {
      like {
        id
        story {
          id
          likesCount
          currentUserLike {
            id
          }
        }
        comment {
          id
          likesCount
          currentUserLike {
            id
          }
        }
      }
    }
  }
`);

const MUTATION_DISLIKE = graphql(`
  mutation dislike($input: DislikeInput!) {
    dislike(input: $input) {
      like {
        id
        story {
          id
          likesCount
          currentUserLike {
            id
          }
        }
        comment {
          id
          likesCount
          currentUserLike {
            id
          }
        }
      }
    }
  }
`);

interface LikeableEntity {
  __typename: 'Story' | 'Comment';
  id: string;
  likesCount: number;
  currentUserLike?: { id: string } | null;
}

interface LikeProps {
  entity: LikeableEntity;
  viewOnly?: boolean;
}

export const Like = ({ entity, viewOnly }: LikeProps) => {
  const { currentUser } = useCurrentUser();
  const [error, setError] = useState(false);
  const { showToast } = useUI();

  const variables = { input: entity.__typename === 'Story' ? { story: entity.id } : { comment: entity.id } };

  // mutations
  const [createLike, { loading: createLoading }] = useMutation(MUTATION_LIKE, {
    variables,
    onCompleted: () => {
      analytics.event({
        action: `like-${entity.__typename.toLowerCase()}`,
        category: 'like',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      analytics.event({
        action: `like-${entity.__typename.toLowerCase()}`,
        category: 'like',
        label: 'error'
      });
      setError(true);
    },
  });
  const [deleteLike, { loading: deleteLoading }] = useMutation(MUTATION_DISLIKE, {
    variables,
    onCompleted: () => {
      analytics.event({
        action: `dislike-${entity.__typename.toLowerCase()}`,
        category: 'like',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      analytics.event({
        action: `dislike-${entity.__typename.toLowerCase()}`,
        category: 'like',
        label: 'error',
      });
      setError(true);
    },
  });

  const isSubmitting = createLoading || deleteLoading;

  const toogleLike = async () => {
    if (viewOnly || isSubmitting) {
      // block submission
      return;
    }

    if (!currentUser) {
      showToast('You need to be logged in.');
      return;
    }

    entity.currentUserLike ? await deleteLike() : await createLike();
  }

  // pick icon fill according to user like presence
  const isLiked = !!entity.currentUserLike;

  return (
    <div className={cn(
      'flex gap-sm items-center',
      error && 'text-error',
    )}>
      {!!entity.likesCount &&
        <Text variant="span">{entity.likesCount}</Text>
      }
      <Heart
        className={cn('w-6 h-6', !viewOnly && 'cursor-pointer')}
        fill={isLiked ? 'currentColor' : 'none'}
        onClick={toogleLike}
      />
    </div>
  );
}
