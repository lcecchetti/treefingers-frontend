'use client';

import { useState } from 'react';
import { Text, Spinner, Button } from '@/components/ui';
import { useQuery } from '@apollo/client';
import { cn } from '@/lib/utils';
import { StoryNew } from '@/components/story/story-new';
import { ChevronDown } from 'lucide-react';
import { ApiError } from '@/components/common';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Navigation } from 'swiper';
import { QUERY_STORIES } from '@/components/story/story-list.query';
import { StoryCard } from '@/components/story/story-card';
import * as analytics from '@/lib/analytics';
import { useCurrentUser } from '@/lib/auth/current-user';

interface StoryChaptersProps {
  className?: string;
  parent: { id: string };
  first?: number;
}

export const StoryChapters = ({ className, parent, first = 10 }: StoryChaptersProps) => {
  const [isWriting, setIsWriting] = useState(false);
  const [suggestSwipe, setSuggestSwipe] = useState(true);
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

  const toggleWriting = (show: boolean) => {
    analytics.event({
      action: 'toggle-writing',
      category: 'chapters',
      label: show ? 'show' : 'hide',
    });
    setIsWriting(show);
  };

  return (
    <div className={cn('flex flex-col gap-md', className)}>
      <ApiError error={error ?? false}/>
      <Spinner loading={loading}/>

      <div className="flex flex-col items-center justify-center gap-xs">
        <Text variant="span" className="font-bold uppercase">What's next?</Text>
        <ChevronDown className="w-8 h-8 animate-bounce" />
      </div>

      {!!data?.stories.edges?.length && // chapter list
        <div className="flex gap-md justify-center items-center">
          <Button variant={isWriting ? 'outlined' : 'primary'} onClick={() => toggleWriting(false)}>Read</Button>
          <Text>Or</Text>
          <Button variant={isWriting ? 'primary' : 'outlined'} onClick={() => toggleWriting(true)}>Write</Button>
        </div>
      }

      <div className="flex flex-col gap-md">
        {!!data?.stories.edges?.length && !isWriting &&
          <Swiper
            key={parent?.id}
            className="w-full"
            modules={[EffectCards, Navigation]}
            effect="cards"
            onSlideChange={() => suggestSwipe && setSuggestSwipe(false)}
            cardsEffect={{
              slideShadows: false,
            }}
            navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev', }}
            onReachEnd={() => data?.stories.pageInfo.hasNextPage && fetchMore({ variables: { after: data?.stories.pageInfo.endCursor } })}
            >
            {data.stories.edges.map(({ node }, index) => (
              <SwiperSlide key={node.id} virtualIndex={index}>
                <StoryCard story={node} className="border-2"/>
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </Swiper>
        }

        {!data!.stories.edges!.length &&
          <div className="text-center flex flex-col gap-xs">
            <Text variant="title" as="span" className="">The end...?</Text>
          </div>
        }

        {(isWriting || (!loading && !data?.stories.edges?.length)) &&
          <StoryNew parent={parent} />
        }
      </div>
    </div>
  );
};
