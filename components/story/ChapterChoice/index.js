
import { useEffect } from 'react';
import { Link, Text, Spinner } from 'components/ui';
import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import StoryNew from 'components/story/StoryNew';
import { FaAngleDown } from 'react-icons/fa';
import { getStoryUrl } from 'lib/helper/story';
import { ApiError, Like } from 'components/common';
import { useCurrentUser } from 'lib/auth/currentUser';
import { TagList } from 'components/tag';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Navigation } from 'swiper';
import { Avatar } from 'components/user';
import { QUERY_STORIES } from 'components/story/StoryList';
import StoryActions from '../StoryActions';

const ChapterChoice = ({ className, parent, first = 10 }) => {
  const currentUser = useCurrentUser();

  const { data, loading, error, refetch, fetchMore } = useQuery(QUERY_STORIES, {
    variables: {
      filter: { parent: { eq: parent._id } },
      first,
    }
  });

  // refresh data with customer specific infos
  useEffect(() => {
    if (currentUser) {
      refetch();
    }
  }, [!currentUser]);

  return (
    <div className={clsx('flex flex-col gap-md ', className)}>
      <ApiError error={error}/>
      <Spinner loading={loading}/>

      {!!data?.stories.edges.length && // chapter list
        <div className="flex flex-col gap-xs">
          <div className="flex flex-col items-center justify-center gap-xs">
            <Text variant="span" className="font-bold uppercase">What's next? </Text>
            <FaAngleDown className="text-3xl animate-bounce" />
          </div>
        </div>
      }

      <div className="flex flex-col gap-md">
        <div>
          {!!data?.stories.edges.length && 
            <Swiper 
              key={parent?._id}
              className=""
              modules={[EffectCards, Navigation]}
              effect="cards"
              navigation={true}
              onReachEnd={() => data?.stories.pageInfo.hasNextPage && fetchMore({ variables: { after: data?.stories.pageInfo.endCursor } })}
              >
              {data.stories.edges.map(({ node, index }) => (
                <SwiperSlide key={node._id} virtualIndex={index} className="h-auto flex flex-col gap-md py-md px-xl justify-between rounded-xl bg-primary border-primary-contrast border-2 text-primary-contrast">
                  <Avatar className="justify-center" user={node.author} showName={true} />
                  <Link href={getStoryUrl(node)}>
                    <Text className="text-center block">{node.title}</Text>
                  </Link>
                  <div className="flex gap-md justify-between items-center">
                    <TagList tags={node.tags} buttonVariant="primary-contrast" />
                    <StoryActions story={node} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          }
          {!data.stories.edges.length &&
            <div className="text-center flex flex-col gap-xs">
              <Text variant="title" as="span" className="">The end...?</Text>
            </div>
          }
        </div>
        <StoryNew parent={parent} />
      </div>
    </div>
  );
};

export default ChapterChoice;

