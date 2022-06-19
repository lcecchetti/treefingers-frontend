
import { useState } from 'react';
import { Text, Spinner, Button } from 'components/ui';
import { useQuery } from '@apollo/client';
import clsx from 'clsx';
import StoryNew from 'components/story/StoryNew';
import { FaAngleDown } from 'react-icons/fa';
import { ApiError } from 'components/common';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Navigation } from 'swiper';
import { QUERY_STORIES } from 'components/story/StoryList';
import StoryCard from 'components/story/StoryCard';
import * as gtag from 'lib/gtag';
import { useCurrentUser } from 'lib/auth/currentUser';

const StoryChapters = ({ className, parent, first = 10 }) => {
  const [isWriting, setIsWriting] = useState(false);
  const { currentUser } = useCurrentUser();

  const { data, loading, error, fetchMore } = useQuery(QUERY_STORIES, {
    variables: {
      filter: { parent: { eq: parent.id } },
      first,
      sort: { likesCount: 'DESC' },
    },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    nextFetchPolicy: 'cache-first',
  });
  
  const toggleWriting = (show) => {
    gtag.event({
      action: 'toggle-writing',
      category: 'chapters',
      label: show ? 'show' : 'hide',
    });
    setIsWriting(show);
  };

  return (
    <div className={clsx('flex flex-col gap-md', className)}>
      <ApiError error={error}/>
      <Spinner loading={loading}/>

      <div className="flex flex-col items-center justify-center gap-xs">
        <Text variant="span" className="font-bold uppercase">What's next?</Text>
        <FaAngleDown className="text-3xl animate-bounce" />
      </div>

      {!!data?.stories.edges.length && // chapter list
        <div className="flex gap-md justify-center items-center">
          <Button variant={isWriting ? 'outlined' : 'primary'} onClick={() => toggleWriting(false)}>Read</Button>
          <Text>Or</Text>
          <Button variant={isWriting ? 'primary' : 'outlined'} onClick={() => toggleWriting(true)}>Write</Button>
        </div>
      }

      <div className="flex flex-col gap-md">
        {!!data?.stories.edges.length && !isWriting &&
          <Swiper 
            key={parent?.id}
            className="w-full"
            modules={[EffectCards, Navigation]}
            effect="cards"
            navigation={true}
            onReachEnd={() => data?.stories.pageInfo.hasNextPage && fetchMore({ variables: { after: data?.stories.pageInfo.endCursor } })}
            >
            {data.stories.edges.map(({ node, index }) => (
              <SwiperSlide key={node.id} virtualIndex={index}>
                <StoryCard story={node} />
              </SwiperSlide>
            ))}
          </Swiper>
        }

        {!data.stories.edges.length &&
          <div className="text-center flex flex-col gap-xs">
            <Text variant="title" as="span" className="">The end...?</Text>
          </div>
        }

        {(isWriting || (!loading && !data?.stories.edges.length)) &&
          <StoryNew parent={parent} />
        }
      </div>
    </div>
  );
};

export default StoryChapters;

