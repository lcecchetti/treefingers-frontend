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
  mutation createLike($story: ID, $author: ID) {
    createLike(input: { data: { story: $story, author: $author } }) {
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

const Like = ({ story, author, comment, currentUserLike, count, viewOnly }) => {

  // current user
  const user = useUser();

  // current user like
  const [userLike, setUserLike] = useState(currentUserLike);

  // error status
  const [isError, setIsError] = useState(false);

  // submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // mutations
  const [createLike] = useMutation(MUTATION_LIKE_CREATE);
  const [deleteLike] = useMutation(MUTATION_LIKE_DELETE);

  // set alays not editable for non logged in users
  viewOnly = viewOnly || !user;

  // keep prop and state aligned
  useEffect(() => {
    setUserLike(currentUserLike);
  }, [currentUserLike]);

  /**
   * Submit like
   */
  const submitLike = async () => {
    try {
      setIsError(false);

      // create like
      const { data } = await createLike({
        variables: {
          story: story?.id,
          author: author?.id,
          comment: comment?.id,
        },
      });

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

    if (currentUserLike && !userLike) {
      userLikeModifier = -1;
    }

    if (!currentUserLike && userLike) {
      userLikeModifier = 1;
    }
    return count + userLikeModifier;
  };

  // pick icon accoridng to user like presence
  const Icon = userLike ? FaHeart : FaRegHeart;

  return (
    <div className={clsx(
      'flex gap-sm align-center',
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