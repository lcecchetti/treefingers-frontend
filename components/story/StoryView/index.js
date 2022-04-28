import { useEffect } from 'react';
import { Spinner, Text, Link, Container, Button } from 'components/ui';
import { DATE_LONG, formatDate } from 'lib/helper/date';
import { getStoryUrl, isStoryRoot } from 'lib/helper/story';
import { gql, useQuery } from '@apollo/client';
import { FaAngleUp, FaAngleDoubleUp } from 'react-icons/fa';
import { Avatar } from 'components/user';
import StoryChapters from 'components/story/StoryChapters';
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
          <div className="relative flex flex-col gap-md lg:min-h-screen overflow-hidden">
            <Container className="flex justify-end">
              <div className="flex flex-col gap-md w-full lg:w-1/2 z-10">
                {data?.story && !isStoryRoot(data.story) &&
                  <div className="text-center flex justify-around items-center">
                    <Button as={Link} variant="outlined" size="sm" href={getStoryUrl(data.story.parent)} icon={FaAngleUp}>Prev chapter</Button>
                    <Button as={Link} variant="outlined" size="sm" href={getStoryUrl(data.story.root)} icon={FaAngleDoubleUp}>Back to root</Button>
                  </div>
                }
                <div className="flex flex-col gap-md">
                  <div className="flex justify-between items-center">
                    <Text variant="span">{formatDate(data.story.createdAt, DATE_LONG)}</Text>
                    <Avatar user={data.story.author} showName={true} />
                  </div>

                  <Text variant="storyTitle">{data.story.title}</Text>
                  <Text variant="p" className="whitespace-pre-wrap">{data.story.content}</Text>

                  <div className="flex justify-between items-center">
                    <TagList tags={data.story.tags} />
                    <StoryActions className="lg:hidden" story={data.story} />
                    <StoryActions className="hidden lg:flex" story={data.story} disabledActions={{ tree: true }} />
                  </div>
                </div>

                <StoryChapters parent={data.story} />
              </div>            
            </Container>

            <StoryTree story={data.story.root || data.story} className="h-screen hidden lg:block lg:h-full w-full lg:absolute bottom-0 left-0 lg:-left-1/4" />
          </div>
        }
    </div>
  );
};

export default StoryView;

