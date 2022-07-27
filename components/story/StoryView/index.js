import { Spinner, Text, Link, Container, Button } from 'components/ui';
import { DATE_LONG, formatDate } from 'lib/helper/date';
import { getStoryUrl, isStoryRoot } from 'lib/helper/story';
import { gql, useQuery } from '@apollo/client';
import { FaAngleUp, FaAngleDoubleUp } from 'react-icons/fa';
import { Avatar } from 'components/user';
import StoryChapters from 'components/story/StoryChapters';
import StoryActions from 'components/story/StoryActions';
import { ApiError } from 'components/common';
import { TagList } from 'components/tag';
import StoryTree from '../StoryTree';
import clsx from 'clsx';
import { getForestUrl } from 'lib/helper/forest';
import { useCurrentUser } from 'lib/auth/currentUser';

export const QUERY_STORY = gql`
  query story($filter: FilterStoryInput!) {
    story(filter: $filter) {
      id
      title
      content
      createdAt
      author {
        id
        username
      }
      tags
      parent {
        id
      }
      root {
        id
        title
        likesCount
        descendentsCount
      }
      forest {
        id
        name
      }
      likesCount
      commentsCount
      descendentsCount
      currentUserLike {
        id
      }
    }
  }
`;

const StoryView = ({ className, story }) => {
  const { currentUser } = useCurrentUser();

  const { data, loading, error } = useQuery(QUERY_STORY, { 
    variables: { 
      filter: { id: { eq: story.id } },
    },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });

  return (
    <div className={clsx('flex flex-col gap-md', className)}>
        <Spinner loading={loading}/>
        <ApiError error={error}/>

        <div className="relative flex flex-col gap-md lg:min-h-screen overflow-hidden">
          <Container className="flex justify-end">
            <div className="flex flex-col gap-md w-full lg:w-1/2 z-10 mb-xl">
              {data.story &&
                <div className="text-center flex justify-around items-center">
                  {!isStoryRoot(data.story) && 
                    <>
                      <Button as={Link} variant="outlined" size="sm" href={getStoryUrl(data.story.parent)} icon={FaAngleUp}>Prev chapter</Button>
                      <Button as={Link} variant="outlined" size="sm" href={getStoryUrl(data.story.root)} icon={FaAngleDoubleUp}>Back to root</Button>
                    </>
                  }
                  {data.story.forest && 
                    <Button as={Link} variant="outlined" size="sm" href={getForestUrl(data.story.forest)} icon={FaAngleDoubleUp}>Back to forest</Button>
                  }
                </div>
              }
              <div className="flex flex-col gap-md">
                <div className="flex justify-between items-center">
                  <Text variant="span">{formatDate(data.story.createdAt, DATE_LONG)}</Text>
                  <Avatar user={data.story.author} showName={true} />
                </div>

                <Text variant="storyTitle" className="break-words w-full">{data.story.title}</Text>
                <Text variant="p" className="whitespace-pre-wrap break-words w-full">{data.story.content}</Text>

                <div className="flex justify-between items-center">
                  <TagList tags={data.story.tags} />
                  <StoryActions className="lg:hidden" story={data.story} />
                  <StoryActions className="hidden lg:flex" story={data.story} disabledActions={{ tree: true }} />
                </div>
              </div>

              <StoryChapters parent={data.story} />
            </div>            
          </Container>

          <StoryTree story={data.story} className="h-screen hidden lg:block lg:h-full w-full lg:absolute bottom-0 left-0 lg:-left-1/4" />
        </div>
    </div>
  );
};

export default StoryView;

