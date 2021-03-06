import { Text, Spinner } from 'components/ui';
import { formatDate } from 'lib/helper';
import { FaTimes } from 'react-icons/fa';
import { Like } from 'components/common';
import { Avatar } from 'components/user';
import { gql, useQuery } from '@apollo/client';

/**
 * Comments list query
 * @type {gql}
 */
export const QUERY_COMMENTS = gql`
  query comments ($story: ID!) {
    comments (where: { story: $story } , limit: 20) {
      id
      content
      createdAt
      likesCount
      currentUserLike {
        id
      }
      user {
        id
        username
      }
    }
  }
`;

const CommentList = ({ story }) => {
  const { data, loading, error } = useQuery(QUERY_COMMENTS, { variables: { story: story.id } });

  return (
    <div className="flex flex-col gap-md p-md h-full">
      {loading && <Spinner />}

      {error && <Text variant="error">{error.message}</Text>}

      {data &&
        <div>
          {!data.comments.length &&
            <Text variant="span">This story has no comments yet.</Text>
          }

          {!!data.comments.length &&
            <ol className="flex flex-col gap-sm">
              {data.comments.map((comment) => (
                <li key={comment.id}>
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
        </div>
      }
    </div>
  );
}

export default CommentList;