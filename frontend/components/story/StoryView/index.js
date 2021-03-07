import { useEffect, useState, useRef } from 'react';
import { Spinner, Text, Link } from 'components/ui';
import { DATE_LONG, formatDate, getStoryUrl } from 'lib/helper';
import { gql, useQuery } from '@apollo/client';
import { FaAngleUp, FaAngleDoubleUp } from 'react-icons/fa';
import { TagList } from 'components/tag';
import { Avatar } from 'components/user';
import { ChapterChoice, StoryActions } from 'components/story';
import { useUser } from 'lib/auth';
import { CommentList } from 'components/comment';

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
      }
      likesCount
      commentsCount
      currentUserLike {
        id
      }
    }
  }
`;

const StoryView = ({ story }) => {

  const user = useUser();
  const [showComments, setShowComments] = useState(false);
  const sidebarRef = useRef(null);

  const { data, loading, error, refetch } = useQuery(QUERY_STORY, { variables: { id: story.id } });

  // refresh data with customer specific infos
  useEffect(() => {
    if (user !== null) {
      refetch();
    }
  }, [user]);

  const onShowComments = () => {
    setShowComments(true);
    sidebarRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-md">
        {loading && <Spinner />}

        {error && <Text variant="error">{error.message}</Text>}

        {data &&
          <>
            {!data.story.isRoot &&
              <div className="text-center mt-sm md:mt-md flex justify-around items-center border-t-2 border-b-2 py-md md:py-lg">
                <Link href={getStoryUrl(data.story.parent)} className="flex flex-col group items-center gap-xs">
                  <FaAngleUp className="text-3xl group-hover:animate-bounce" />
                  <Text variant="span" className="font-bold uppercase">Back to previous chapter</Text>
                </Link>
                <Link href={getStoryUrl(data.story.root)} className="flex flex-col group items-center gap-xs">
                  <FaAngleDoubleUp className="text-3xl group-hover:animate-bounce" />
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
                <StoryActions story={data.story} commentAction={onShowComments} />
              </div>
            </div>

            <ChapterChoice parent={data.story} />
          </>
        }
    </div >
  );
};

export default StoryView;

