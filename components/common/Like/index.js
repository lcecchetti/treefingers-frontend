import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { gql, useMutation } from '@apollo/client';
import { Text } from 'components/ui';
import clsx from 'clsx';
import { useCurrentUser } from 'lib/auth/currentUser';

/**
 * Create like mutation
 * @type {gql}
 */
const MUTATION_LIKE_STORY = gql`
  mutation likeStory($input: LikeStoryInput!) {
    likeStory(input: $input) {
      like {
        _id
        story {
          _id
          likesCount
          currentUserData {
            like {
              _id
            }
          }
        }
      } 
    }
  }
`;

/**
 * Create like mutation
 * @type {gql}
 */
 const MUTATION_LIKE_COMMENT = gql`
 mutation likeComment($input: LikeCommentInput!) {
  likeComment(input: $input) {
    like {
      _id
      comment {
        _id
        likesCount
        currentUserData {
          like {
            _id
          }
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
const MUTATION_DISLIKE_STORY = gql`
  mutation dislikeStory($input: DislikeStoryInput!) {
    dislikeStory(input: $input) {
      like {
        _id
        story {
          _id
          likesCount
          currentUserData {
            like {
              _id
            }
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
 const MUTATION_DISLIKE_COMMENT = gql`
 mutation dislikeComment($input: DislikeCommentInput!) {
   dislikeComment(input: $input) {
     like {
       _id
       comment {
        _id
        likesCount
        currentUserData {
          like {
            _id
          }
        }
       }
     } 
   }
 }
`;

/**
 * Get entity type
 * @param {string} entityType
 * @returns {String}
 */
const getLikeMutation = (entityType) =>  {
  switch (entityType) {
    case 'story':
      return MUTATION_LIKE_STORY;
    case 'comment':  
      return MUTATION_LIKE_COMMENT;
  }
}

/**
 * Get entity type
 * @param {string} entityType
 * @returns {String}
 */
 const getDislikeMutation = (entityType) =>  {
  switch (entityType) {
    case 'story':
      return MUTATION_DISLIKE_STORY;
    case 'comment':  
      return MUTATION_DISLIKE_COMMENT;
  }
}

const Like = ({ entity, viewOnly }) => {

  // get entity type
  const entityType = entity.__typename.toLowerCase();

  // current user
  const currentUser = useCurrentUser();

  const variables = { input: {} };
  variables.input[entityType] = entity._id;

  // mutations
  const [createLike, { error: createError, loading: createLoading }] = useMutation(getLikeMutation(entityType), {
    variables,
  });
  const [deleteLike, { error: deleteError, loading: deleteLoading }] = useMutation(getDislikeMutation(entityType), {
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

    entity.currentUserData?.like ? await deleteLike() : await createLike();
  }

  // pick icon accoridng to user like presence
  const Icon = entity.currentUserData?.like ? FaHeart : FaRegHeart;

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