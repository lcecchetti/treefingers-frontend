import { Spinner, Text, Link } from 'components/ui';
import { DATE_LONG, formatDate, getStoryUrl } from 'lib/helper';
import { gql, useQuery } from '@apollo/client';
import { FaHeart, FaRegHeart, FaAngleDown, FaAngleUp, FaAngleDoubleUp } from 'react-icons/fa';
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
      isRoot
      author {
        id
        username
      }
      tags {
        id
        label
        slug
      }
      parent {
        id
      }
      root {
        id
        title
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
        <div className="md:my-md flex flex-col gap-md">
          {!data.story.isRoot &&
            <div className="text-center flex justify-around items-center">
              <Link href={getStoryUrl(data.story.parent)} underline={false} className="flex flex-col group items-center gap-xs">
                <FaAngleUp className="text-3xl group-hover:animate-bounce"/>
                <Text variant="span" className="font-bold uppercase">Back to previous chapter</Text>
              </Link>
              <Link href={getStoryUrl(data.story.root)} underline={false} className="flex flex-col group items-center gap-xs">
                <FaAngleDoubleUp className="text-3xl group-hover:animate-bounce"/>
                <Text variant="span" className="font-bold uppercase">Back to the beginning</Text>
              </Link>
            </div>
          }

          <div className="flex flex-col gap-xs">
            <div className="flex justify-between items-center">
              <Text variant="span">{formatDate(data.story.createdAt, DATE_LONG)}</Text>
              <Avatar user={data.story.author} showName={true} />
            </div>

            <div>
              <Text variant="storyViewTitle">{data.story.title}</Text>
              <Text variant="p">{data.story.content}</Text>
            </div>

            <div className="flex justify-between items-center">
              <TagList tags={data.story.tags} />
              <FaRegHeart className="text-xl" />
            </div>
          </div>
        
          <ChapterChoice parent={data.story} />
        </div>
      }
    </div>
  );
};

export default StoryView;

