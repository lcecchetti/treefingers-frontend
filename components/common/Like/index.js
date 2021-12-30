import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import { Text } from 'components/ui';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';

/**
 * Store like relations
 * @type gql
 */
const FRAGMENT_LIKE_RELATIONS = gql`
  fragment LikeRelations on Like {
    story {
      _id
      likesCount
      currentUserLike {
        _id
      }
    }
    author {
      _id
      likesCount
      currentUserLike {
        _id
      }
    }
    comment {
      _id
      likesCount
      currentUserLike {
        _id
      }
    }
  }
`;

/**
 * Create like mutation
 * @type {gql}
 */
const MUTATION_LIKE_CREATE = gql`
  mutation createLike($story: ID, $author: ID, $comment: ID) {
    createLike(input: { data: { story: $story, author: $author, comment: $comment } }) {
      like {
        _id
        ...LikeRelations
      } 
    }
  }
  ${FRAGMENT_LIKE_RELATIONS}
`;

/**
 * Delete like mutation
 * @type {gql}
 */
const MUTATION_LIKE_DELETE = gql`
  mutation deleteLike($_id: ID!) {
    deleteLike(input: { filter: { _id: { eq: $_id } } }) {
      like {
        _id
        ...LikeRelations
      } 
    }
  }
  ${FRAGMENT_LIKE_RELATIONS}
`;

/**
 * Get entity type
 * @param {Object} entity 
 * @returns {String}
 */
const getEntityType = (entity) =>  {
  return entity.__typename == 'User' ? 'author' : entity.__typename.toLowerCase();
}

const Like = ({ entity, viewOnly }) => {

  // get entity type
  const entityType = getEntityType(entity);

  // current user
  const currentUser = useCurrentUser();

  // error status
  const [isError, setIsError] = useState(false);

  // submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // mutations
  const [createLike] = useMutation(MUTATION_LIKE_CREATE);
  const [deleteLike] = useMutation(MUTATION_LIKE_DELETE);

  // set always not editable for non logged in users
  viewOnly = viewOnly || !currentUser;

  /**
   * Submit like
   */
  const submitLike = async () => {
    try {
      setIsError(false);

      const variables = {};
      variables[entityType] = entity._id;

      // create like
      await createLike({ variables });

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
      await deleteLike({
        variables: {
          _id: entity.currentUserLike._id,
        },
      });

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
    entity.currentUserLike ? await removeLike() : await submitLike();
    setIsSubmitting(false);
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