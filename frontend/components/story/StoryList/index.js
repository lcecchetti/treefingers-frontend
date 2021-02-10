import { Link, Spinner, Text } from 'components/ui';
import { getExcerpt, getStoryUrl } from 'lib/helper/story';
import { formatDate } from 'lib/helper/date';
import { gql, useQuery } from '@apollo/client';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { TagList } from 'components/tag';

/**
 * Story fields fragment
 * @type {gql}
 */
const FRAGMENT_STORIES = gql`
  fragment StoriesFields on Story {
    id
    title
    content
    slug
    createdAt
    author {
      id
      username
    }
    tags {
      id
      label
      slug
    }
  }
`;

/**
 * Story list query
 * @type {gql}
 */
export const QUERY_STORIES = gql`
  query stories($author: ID, $tag: ID) {
    stories(where: { author: $author, tags: $tag }) {
      ...StoriesFields
    }
  }
  ${FRAGMENT_STORIES}
`;


const StoryList = ({ titleVariant = 'pageTitle', title= 'Stories', queryVariables }) => {
  const { data, loading, error } = useQuery(QUERY_STORIES, { variables: queryVariables });

  return (
    <div className="pt-md">
      <Text variant={titleVariant}>{title}</Text>

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
            <TagList tags={story.tags} />
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

