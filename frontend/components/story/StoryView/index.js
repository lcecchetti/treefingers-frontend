import { Spinner, Text } from 'components/ui';
import { DATE_LONG, formatDate } from 'lib/helper';
import { gql, useQuery } from '@apollo/client';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { TagList } from 'components/tag';
import { Avatar } from 'components/user';
import { ChapterChoice } from 'components/story';

/**
 * Single story query
 * @type {gql}
 */
export const QUERY_STORY = gql`
  query story($id: ID!) {
    story(id: $id) {
      id
      title
      content
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
      children {
        id
        action
        root {
          id
        }
      }
      parent {
        id
      }
      root {
        id
      }
    }
  }
`;

const StoryView = ({ id }) => {

  const { data, loading, error } = useQuery(QUERY_STORY, { variables: { id } });

  return (
    <div>
      {loading && <Spinner />}

      {error && <Text variant="error">{error.message}</Text>}

      {data &&
        <div className="md:my-md">
          <div className="flex justify-between items-center mb-xs">
            <Text variant="span">{formatDate(data.story.createdAt, DATE_LONG)}</Text>
            <Avatar user={data.story.author} showName={true} />
          </div>
          <div className="mb-md">
            <Text variant="storyViewTitle">{data.story.title}</Text>
            <Text variant="p">{data.story.content}</Text>
          </div>
          <div className="flex justify-between">
            <FaRegHeart className="text-xl" />
            <TagList tags={data.story.tags} />
          </div>
          <ChapterChoice className="my-md" parent={data.story} />
        </div>
      }
    </div>
  );
};

export default StoryView;

