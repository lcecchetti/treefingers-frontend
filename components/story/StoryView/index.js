import { useEffect } from 'react';
import { Spinner, Text, Link } from 'components/ui';
import { DATE_LONG, formatDate } from 'lib/helper/date';
import { getStoryUrl } from 'lib/helper/story';
import { gql, useQuery } from '@apollo/client';
import { FaAngleUp, FaAngleDoubleUp } from 'react-icons/fa';
import { Avatar } from 'components/user';
import ChapterChoice from 'components/story/ChapterChoice';
import StoryActions from 'components/story/StoryActions';
import { useCurrentUser } from 'lib/auth/currentUser';
import { ApiError } from 'components/common';
import { TagList } from 'components/tag';
import StoryTree from '../StoryTree';

/**
 * Single story query
 * @type {gql}
 */
export const QUERY_STORY = gql`
  query story($filter: FilterStoryInput!) {
    story(filter: $filter) {
      _id
      title
      content
      createdAt
      author {
        _id
        username
      }
      tags
      parent {
        _id
      }
      root {
        _id
      }
      likesCount
      commentsCount
      currentUserLike {
        _id
      }
    }
  }
`;

const StoryView = ({ story }) => {
  const currentUser = useCurrentUser();

  const { data, loading, error, refetch } = useQuery(QUERY_STORY, { variables: { filter: { _id: { eq: story._id } } } });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);

  return (
    <div className="flex flex-col gap-md">
        <Spinner loading={loading}/>
        <ApiError error={error}/>

        {data &&
          <>
            {data.story.root &&
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="">
                <StoryTree story={data.story} className="h-screen w-full sticky top-0" />
              </div>  
              <div className="flex flex-col gap-md z-10">
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
                    <StoryActions story={data.story} />
                  </div>
                </div>
                <ChapterChoice parent={data.story} />
              </div>            
            </div>
          </>
        }
    </div>
  );
};

export default StoryView;

