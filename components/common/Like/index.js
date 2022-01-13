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
  mutation createLike($input: CreateLikeInput!) {
    createLike(input: $input) {
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
  mutation deleteLike($input: DeleteLikeInput!) {
    deleteLike(input: $input) {
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

  const createVariables = { input: { data: {} } };
  createVariables.input.data[entityType] = entity._id;

  // mutations
  const [createLike, { error: createError, loading: createLoading }] = useMutation(MUTATION_LIKE_CREATE, {
    variables: createVariables,
  });
  const [deleteLike, { error: deleteError, loading: deleteLoading }] = useMutation(MUTATION_LIKE_DELETE, {
    variables: { input: { filter: { _id: { eq: entity.currentUserLike?._id } } } },
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