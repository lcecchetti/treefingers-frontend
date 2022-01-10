import { useEffect } from 'react';
import { Link, Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Avatar } from 'components/user';
import { ApiError, Like } from 'components/common';
import { getStoryUrl } from 'lib/helper/story';
import { useCurrentUser } from 'lib/auth/currentUser';

/**
 * Authors list query
 * @type {gql}
 */
export const QUERY_AUTHORS = gql`
  query users($filter: UserFilterInput) {
    users (filter: $filter) {
      edges {
        node {
          _id
          username
          excerpt
          stories(filter: { root: null }) {
            edges {
              node {
                _id
                title
              }
            }
          }
          currentUserLike {
            _id
          }
          likesCount
        }
      }
    }
  }
`;

const AuthorList = ({ className }) => {
  const currentUser = useCurrentUser();
  const { data, loading, error, refetch } = useQuery(QUERY_AUTHORS);

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser !== null) {
      refetch();
    }
  }, [currentUser]);

  return (
    <div className={clsx('grid md:grid-cols-4 gap-md', className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {data?.users && data.users.edges.map(({ node: author }) => (
        <div key={author._id} className="text-primary-contrast bg-primary rounded-xl flex flex-col p-md">
          <div className="flex justify-between items-center">
            <Avatar user={author} showName={true} />
            <Like entity={author} />
          </div>

          <ul className="mt-sm">
            {author.stories && author.stories.edges.map(({ node: story }) => (
              <li key={story._id}>
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

