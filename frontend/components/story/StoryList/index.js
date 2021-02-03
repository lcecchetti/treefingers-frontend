import { Link, Spinner, Text } from 'components/ui';
import { getExcerpt, getStoryUrl } from 'lib/helper/story';
import { formatDate } from 'lib/helper/date';
import { gql, useQuery } from '@apollo/client';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

/**
 * Self query
 * @type {gql}
 */
const QUERY_STORIES = gql`
  query stories {
    stories {
      id
      title
      content
      slug
      createdAt
      author {
        id
        username
      }
    }
  }
`;


const StoryList = () => {
  const { data, loading, error } = useQuery(QUERY_STORIES);

  return (
    <div className="">
      {loading && <Spinner />}

      {error && <Text variant="span" className="text-error">{error}</Text>}

      {data?.stories && data.stories.map((story) => (
        <div key={story.id} className="">
          <div>
            <Text variant="h3"><Link href={getStoryUrl(story)} underline={false}>{story.title}</Link></Text>
            <Text variant="span">Written by {story.author.username} on {formatDate(story.createdAt)}</Text>
          </div>
          <div>
            <Text variant="p">{getExcerpt(story)}</Text>
          </div>
          <div>
            <FaRegHeart className="text-xl" />
            <Link href={getStoryUrl(story)}>Read more</Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryList;

