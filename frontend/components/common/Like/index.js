import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import { Text } from 'components/ui';
import clsx from 'clsx';
import { useUser } from 'lib/auth';

/**
 * Create like mutation
 * @type {gql}
 */
const MUTATION_LIKE_CREATE = gql`
  mutation createLike($story: ID, $author: ID, $comment: ID) {
    createLike(input: { data: { story: $story, author: $author, comment: $comment } }) {
      like {
        id
      } 
    }
  }
`;

/**
 * Delete like mutation
 * @type {gql}
 */
const MUTATION_LIKE_DELETE = gql`
  mutation deleteLike($id: ID!) {
    deleteLike(input: { where: { id: $id } }) {
      like {
        id
      } 
    }
  }
`;

const Like = ({ entity, viewOnly }) => {

  const entityType = entity.__typename == 'UsersPermissionsUser' ? 'author' : entity.__typename.toLowerCase();

  // current user
  const user = useUser();

  // current user like
  const [userLike, setUserLike] = useState(entity.currentUserLike);

  // error status
  const [isError, setIsError] = useState(false);

  // submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // mutations
  const [createLike] = useMutation(MUTATION_LIKE_CREATE);
  const [deleteLike] = useMutation(MUTATION_LIKE_DELETE);

  // set always not editable for non logged in users
  viewOnly = viewOnly || !user;

  // keep prop and state aligned
  useEffect(() => {
    setUserLike(entity.currentUserLike);
  }, [entity.currentUserLike]);

  /**
   * Submit like
   */
  const submitLike = async () => {
    try {
      setIsError(false);

      const variables = {};
      variables[entityType] = entity.id;

      // create like
      const { data } = await createLike({ variables });

      // update like if success
      if (data.createLike.like) {
        setUserLike(data.createLike.like);
      }

    } catch (e) {
      setIsError(true);
    }
  };

  /**
   * Remove like
   */
  const removeLike = async () => {
    try {
      setIsError(false);

      // delete like
      const { data } = await deleteLike({
        variables: {
          id: userLike.id,
        },
      });

      // update like if success
      if (data.deleteLike.like) {
        setUserLike(null);
      }

    } catch (e) {
      setIsError(true);
    }
  };

  /**
   * Toogle like status for logged in users
   */
  const toogleLike = async () => {
    if (viewOnly || isSubmitting) {
      // block submission
      return;
    }

    setIsSubmitting(true);
    userLike ? await removeLike() : await submitLike();
    setIsSubmitting(false);
  }

  /**
   * Get like count keeping current user like into consideration
   * @return {int}
   */
  const getCount = () => {
    let userLikeModifier = 0;

    if (entity.currentUserLike && !userLike) {
      userLikeModifier = -1;
    }

    if (!entity.currentUserLike && userLike) {
      userLikeModifier = 1;
    }
    return entity.likesCount + userLikeModifier;
  };

  // pick icon accoridng to user like presence
  const Icon = userLike ? FaHeart : FaRegHeart;

  return (
    <div className={clsx(
      'flex gap-sm items-center',
      isError && 'text-error',
    )}>
      {!!getCount() &&
        <Text variant="span">{getCount()}</Text>
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