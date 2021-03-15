import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import { Text } from 'components/ui';
import clsx from 'clsx';
import { useUser } from 'lib/auth';

/**
 * Store like relations
 * @type gql
 */
const FRAGMENT_LIKE_RELATIONS = gql`
  fragment LikeRelations on Like {
    story {
      id
      likesCount
      currentUserLike {
        id
      }
    }
    author {
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
`;

/**
 * Create like mutation
 * @type {gql}
 */
const MUTATION_LIKE_CREATE = gql`
  mutation createLike($story: ID, $author: ID, $comment: ID) {
    createLike(input: { data: { story: $story, author: $author, comment: $comment } }) {
      like {
        id
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
  mutation deleteLike($id: ID!) {
    deleteLike(input: { where: { id: $id } }) {
      like {
        id
        ...LikeRelations
      } 
    }
  }
  ${FRAGMENT_LIKE_RELATIONS}
`;

const Like = ({ entity, viewOnly }) => {

  console.log(entity);
  // get entity type
  const entityType = entity.__typename == 'UsersPermissionsUser' ? 'author' : entity.__typename.toLowerCase();

  // current user
  const user = useUser();

  // error status
  const [isError, setIsError] = useState(false);

  // submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // mutations
  const [createLike] = useMutation(MUTATION_LIKE_CREATE);
  const [deleteLike] = useMutation(MUTATION_LIKE_DELETE);

  // set always not editable for non logged in users
  viewOnly = viewOnly || !user;

  /**
   * Submit like
   */
  const submitLike = async () => {
    try {
      setIsError(false);

      const variables = {};
      variables[entityType] = entity.id;

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
          id: entity.currentUserLike.id,
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