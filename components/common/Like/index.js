import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import { Text } from 'components/ui';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';

/**
 * Create like mutation
 * @type {gql}
 */
const MUTATION_LIKE = gql`
  mutation like($input: LikeInput!) {
    like(input: $input) {
      like {
        _id
        entityType
        entity {
          _id
          likesCount
          currentUserLike {
            _id
          }
        }
      } 
    }
  }
`;

/**
 * Delete like mutation
 * @type {gql}
 */
const MUTATION_DISLIKE = gql`
  mutation dislike($input: DislikeInput!) {
    dislike(input: $input) {
      like {
        _id
        entityType
        entity {
          _id
          likesCount
          currentUserLike {
            _id
          }
        }
      } 
    }
  }
`;

const Like = ({ entity, viewOnly }) => {
  const { currentUser } = useCurrentUser();

  const variables = { input: { entityType: entity.__typename, entity: entity._id } }

  // mutations
  const [createLike, { error: createError, loading: createLoading }] = useMutation(MUTATION_LIKE, {
    variables,
  });
  const [deleteLike, { error: deleteError, loading: deleteLoading }] = useMutation(MUTATION_DISLIKE, {
    variables,
  });

  const isSubmitting = createLoading || deleteLoading;
  const isError = createError || deleteError;

  // set always not editable for non logged in users
  viewOnly = viewOnly || !currentUser;

  /**
   * Toogle like status for logged in users
   */
  const toogleLike = async () => {
    if (viewOnly || isSubmitting) {
      // block submission
      return;
    }

    entity.currentUserLike ? await deleteLike() : await createLike();
  }

  // pick icon accoridng to user like presence
  const Icon = entity.currentUserLike ? FaHeart : FaRegHeart;

  return (
    <div className={clsx(
      'flex gap-sm items-center',
      isError && 'text-error',
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