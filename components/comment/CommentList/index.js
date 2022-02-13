import { useRef, useEffect } from 'react';
import { Text, Spinner } from 'components/ui';
import { formatDate } from 'lib/helper/date';
import { ApiError, Like } from 'components/common';
import { Avatar } from 'components/user';
import { gql, useQuery } from '@apollo/client';
import { CommentNew } from 'components/comment';

/**
 * Comment fields
 * @type gql
 */
 export const FRAGMENT_COMMENT_FIELDS = gql`
  fragment CommentFields on Comment {
    _id
    content
    createdAt
    likesCount
    currentUserData {
      like {
        _id
      }
    }
    user {
      _id
      username
      pseudonym
    }
    story {
      _id
      commentsCount
    }
    forest {
      _id
      commentsCount
    }
  }
`;

/**
 * Comments list query
 * @type {gql}
 */
export const QUERY_COMMENTS = gql`
  query comments($filter: FilterCommentInput) {
    comments (filter: $filter) {
      edges {
        node {
          ...CommentFields
        }
      }
    }
  }
  ${FRAGMENT_COMMENT_FIELDS}
`;

/**
 * Get entity type
 * @param {Object} entity 
 * @returns {String}
 */
 const getEntityType = (entity) =>  {
  return entity.__typename.toLowerCase();
}

const CommentList = ({ entity }) => {
  const entityType = getEntityType(entity);

  const filter = {};
  filter[entityType] = { eq: entity._id };

  const { data, loading, error } = useQuery(QUERY_COMMENTS, { variables: { filter } });

  // scroll to bottom anchor
  const bottomRef = useRef(null);

  // scroll to bottom function
  const scrollToBottom = () => bottomRef.current.scrollIntoView();  

  // scroll to bottom each time a new comment list has loaded
  useEffect(() => {
    scrollToBottom();
  }, [filter]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-md p-md">
        <Spinner loading={loading}/>
        <ApiError error={error}/>

        {data &&
          <div className="flex flex-col gap-md">
            {!data?.comments.edges.length &&
              <Text variant="span">This {entityType} has no comments yet.</Text>
            }

            {!!data?.comments.edges.length &&
              <ol className="flex flex-col gap-sm">
                {data.comments.edges.map(({ node }) => (
                  <li key={node._id}>
                    <div className="flex flex-col gap-xs">
                      <Avatar user={node.user} showName={true} />
                      <Text variant="span">{node.content}</Text>
                      <div className="flex justify-between items-center">
                        <Text variant="span" className="text-sm">{formatDate(node.createdAt)}</Text>
                        <Like entity={node} />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            }

            <CommentNew entity={entity} />
          </div>
        }
      </div>

      <div ref={bottomRef}/>
    </div >
  );
}

export default CommentList;