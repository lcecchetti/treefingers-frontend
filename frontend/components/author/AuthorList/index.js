import { useEffect } from 'react';
import { Link, Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Avatar } from 'components/user';
import { Like } from 'components/common';
import { getStoryUrl } from 'lib/helper';
import { useUser } from 'lib/auth';

/**
 * Authors list query
 * @type {gql}
 */
export const QUERY_AUTHORS = gql`
  query users {
    users (limit: 20, where: { stories: { isRoot: true } }) {
      id
      username
      excerpt
      stories (limit: 5, sort: "likesCount:desc") {
        id
        title
      }
      currentUserLike {
        id
      }
      likesCount
    }
  }
`;

const AuthorList = ({ className }) => {
  const user = useUser();
  const { data, loading, error, refetch } = useQuery(QUERY_AUTHORS);

  // refresh data with customer specific infos
  useEffect(() => {
    if (user !== null) {
      refetch();
    }
  }, [user]);

  return (
    <div className={clsx('grid md:grid-cols-4 gap-md', className)}>
      {loading && <Spinner />}

      {error && <Text variant="error">{error.message}</Text>}

      {data?.users && data.users.map((author) => (
        <div key={author.id} className="text-primary-contrast bg-primary rounded-xl flex flex-col p-md">
          <div className="flex justify-between items-center">
            <Avatar user={author} showName={true} />
            <Like author={author} currentUserLike={author.currentUserLike} count={author.likesCount} />
          </div>

          <ul className="mt-sm">
            {author.stories.map((story) => (
              <li key={story.id}>
                <Link href={getStoryUrl(story)}>{story.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AuthorList;

