import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { graphql } from 'lib/graphql/generated';
import { Text } from 'components/ui';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';
import { useState } from 'react';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';

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

const Like = ({ entity, viewOnly }: LikeProps) => {
  const { currentUser } = useCurrentUser();
  const [error, setError] = useState(false);
  const { showToast } = useUI();

  const variables = { input: entity.__typename === 'Story' ? { story: entity.id } : { comment: entity.id } };

  // mutations
  const [createLike, { loading: createLoading }] = useMutation(MUTATION_LIKE, {
    variables,
    onCompleted: () => {
      gtag.event({
        action: `like-${entity.__typename.toLowerCase()}`,
        category: 'like',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      gtag.event({
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
      gtag.event({
        action: `dislike-${entity.__typename.toLowerCase()}`,
        category: 'like',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      gtag.event({
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

  // pick icon according to user like presence
  const Icon = entity.currentUserLike ? FaHeart : FaRegHeart;

  return (
    <div className={clsx(
      'flex gap-sm items-center',
      error && 'text-error',
    )}>
      {!!entity.likesCount &&
        <Text variant="span">{entity.likesCount}</Text>
      }
      <Icon className={clsx(
        'text-2xl',
        !viewOnly && 'cursor-pointer',
      )}
      onClick={toogleLike} />
    </div>
  );
}

export default Like;
