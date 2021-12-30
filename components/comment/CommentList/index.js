import { useRef, useEffect } from 'react';
import { Text, Spinner } from 'components/ui';
import { formatDate } from 'lib/helper';
import { Like } from 'components/common';
import { Avatar } from 'components/user';
import { gql, useQuery } from '@apollo/client';
import { CommentNew } from 'components/comment';

/**
 * Comments list query
 * @type {gql}
 */
export const QUERY_COMMENTS = gql`
  query comments ($story: ID!) {
    comments (filter: { story: { eq: $story } }) {
      _id
      content
      createdAt
      likesCount
      currentUserLike {
        _id
      }
      user {
        _id
        username
      }
    }
  }
`;

const CommentList = ({ story }) => {
  const { data, loading, error } = useQuery(QUERY_COMMENTS, { variables: { story: story._id } });

  // scroll to bottom anchor
  const bottomRef = useRef(null);

  // scroll to bottom function
  const scrollToBottom = () => bottomRef.current.scrollIntoView();  

  // scroll to bottom each time a new comment list has loaded
  useEffect(() => {
    scrollToBottom();
  }, [story._id, loading]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-md p-md">
        {loading && <Spinner />}

        {error && <Text variant="error">{error.message}</Text>}

        {data &&
          <div className="flex flex-col gap-md">
            {!data.comments.length &&
              <Text variant="span">This story has no comments yet.</Text>
            }

            {!!data.comments.length &&
              <ol className="flex flex-col gap-sm">
                {data.comments.map((comment) => (
                  <li key={comment._id}>
                    <div className="flex flex-col gap-xs">
                      <Avatar user={comment.user} showName={true} />
                      <Text variant="span">{comment.content}</Text>
                      <div className="flex justify-between items-center">
                        <Text variant="span" className="text-sm">{formatDate(comment.createdAt)}</Text>
                        <Like entity={comment} />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            }

            <CommentNew story={story} />
          </div>
        }
      </div>

      <div ref={bottomRef}/>
    </div >
  );
}

export default CommentList;