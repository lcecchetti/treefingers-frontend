import { Link, Spinner, Text } from 'components/ui';
import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { Avatar } from 'components/user';
import { FaRegHeart } from 'react-icons/fa';
import { getStoryUrl } from 'lib/helper';

/**
 * Authors list query
 * @type {gql}
 */
export const QUERY_AUTHORS = gql`
  query users {
    users {
      id
      username
      excerpt
      stories {
        id
        title
      }
    }
  }
`;

//@todo limit to users with at least one story
const AuthorList = ({ className }) => {
  const { data, loading, error } = useQuery(QUERY_AUTHORS);

  return (
    <div className={clsx('grid md:grid-cols-4 gap-md', className)}>
      {loading && <Spinner />}

      {error && <Text variant="error">{error.message}</Text>}

      {data?.users && data.users.map((author) => (
        <div key={author.id} className="text-primary-contrast bg-primary rounded-xl flex flex-col p-md">
          <div className="flex justify-between items-center">
            <Avatar user={author} showName={true} />
            <FaRegHeart className="text-2xl" />
          </div>
          
          <ul className="mt-sm">
            {author.stories.map((story) => (
              <li key={story.id}>
                <Link href={getStoryUrl(story)} underline={false}>{story.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AuthorList;

