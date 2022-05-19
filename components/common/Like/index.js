import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import { Text } from 'components/ui';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';
import { useState } from 'react';
import * as gtag from 'lib/gtag';
import { useUI } from 'lib/ui/context';

const MUTATION_LIKE = gql`
  mutation like($input: LikeInput!) {
    like(input: $input) {
      like {
        id
        entityType
        entity {
          id
          likesCount
          currentUserLike {
            id
          }
        }
      } 
    }
  }
`;

const MUTATION_DISLIKE = gql`
  mutation dislike($input: DislikeInput!) {
    dislike(input: $input) {
      like {
        id
        entityType
        entity {
          id
          likesCount
          currentUserLike {
            id
          }
        }
      } 
    }
  }
`;

const Like = ({ entity, viewOnly }) => {
  const { currentUser } = useCurrentUser();
  const [error, setError] = useState(false);
  const { showToast } = useUI();

  const variables = { input: { entityType: entity.__typename, entityId: entity.id } }

  // mutations
  const [createLike, { loading: createLoading }] = useMutation(MUTATION_LIKE, {
    variables,
    onCompleted: () => {
      gtag.event({
        action: `like-${entity.__typename}`,
        category: 'like',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      gtag.event({
        action: `like-${entity.__typename}`,
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
        action: `dislike-${entity.__typename}`,
        category: 'like',
        label: 'success',
      });
      setError(false);
    },
    onError: () => {
      gtag.event({
        action: `dislike-${entity.__typename}`,
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

  // pick icon accoridng to user like presence
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