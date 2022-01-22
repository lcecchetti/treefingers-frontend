import { Link } from 'components/ui';
import clsx from 'clsx';
import { Avatar } from 'components/user';
import { Like } from 'components/common';
import { getStoryUrl } from 'lib/helper/story';
import { gql } from '@apollo/client';

/**
 * Auhtor card fields
 * @type gql
 */
 export const FRAGMENT_AUTHOR_CARD_FIELDS = gql`
  fragment AuthorCardFields on User {
    _id
    username
    pseudonym
    excerpt
    stories(filter: { root: null }, pagination: { pageSize: 5 }) {
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
`;

const AuthorCard = ({ className, author }) => {
  return (
    <div key={author._id} className={clsx('text-primary-contrast bg-primary rounded-xl flex flex-col p-md', className)}>
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
  );
};

export default AuthorCard;

