'use client';

import { Suspense, useState, useTransition } from 'react';
import { Text, Spinner, Button } from '@/components/ui';
import { useSuspenseQuery } from '@apollo/client/react';
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
import type { StoriesQuery } from '@/lib/graphql/generated/graphql';
import type { ErrorLike } from '@apollo/client';

interface StoryChaptersProps {
  className?: string;
  parent: { id: string };
  first?: number;
}

interface StoryChaptersViewProps {
  className?: string;
  parentId: string;
  edges?: StoriesQuery['stories']['edges'];
  error?: ErrorLike | false;
  hasNextPage?: boolean;
  onReachEnd?: () => void;
}

// Presentational carousel shared by the live chapters view (StoryChaptersContent
// below) and StoryChaptersStatic's SSR fallback, so the two can't diverge.
export const StoryChaptersView = ({ className, parentId, edges, error, hasNextPage, onReachEnd }: StoryChaptersViewProps) => {
  const [isWriting, setIsWriting] = useState(false);
  const [suggestSwipe, setSuggestSwipe] = useState(true);

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

      <div className="flex flex-col items-center justify-center gap-xs">
        <Text variant="span" className="font-bold uppercase">What's next?</Text>
        <ChevronDown className="w-8 h-8 animate-bounce" />
      </div>

      {!!edges?.length && // chapter list
        <div className="flex gap-md justify-center items-center">
          <Button variant={isWriting ? 'outlined' : 'primary'} onClick={() => toggleWriting(false)}>Read</Button>
          <Text>Or</Text>
          <Button variant={isWriting ? 'primary' : 'outlined'} onClick={() => toggleWriting(true)}>Write</Button>
        </div>
      }

      <div className="flex flex-col gap-md">
        {!!edges?.length && !isWriting &&
          <Swiper
            key={parentId}
            className="w-full"
            modules={[EffectCards, Navigation]}
            effect="cards"
            onSlideChange={() => suggestSwipe && setSuggestSwipe(false)}
            cardsEffect={{
              slideShadows: false,
            }}
            navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev', }}
            onReachEnd={() => hasNextPage && onReachEnd?.()}
            >
            {edges.map(({ node }, index) => (
              <SwiperSlide key={node.id} virtualIndex={index}>
                <StoryCard story={node} className="border-2"/>
              </SwiperSlide>
            ))}
            <div className="swiper-button-prev"></div>
            <div className="swiper-button-next"></div>
          </Swiper>
        }

        {!edges?.length &&
          <div className="text-center flex flex-col gap-xs">
            <Text variant="title" as="span" className="">The end...?</Text>
          </div>
        }

        {(isWriting || !edges?.length) &&
          <StoryNew parent={{ id: parentId }} />
        }
      </div>
    </div>
  );
};

const StoryChaptersContent = ({ className, parent, first = 10 }: StoryChaptersProps) => {
  const [, startTransition] = useTransition();
  const { currentUser } = useCurrentUser();

  const { data, error, fetchMore } = useSuspenseQuery(QUERY_STORIES, {
    variables: {
      filter: { parent: { eq: parent.id } },
      first,
      sort: { likesCount: 'DESC' },
    },
    fetchPolicy: currentUser ? 'cache-and-network' : 'cache-first',
    errorPolicy: 'all',
  });

  return (
    <StoryChaptersView
      className={className}
      parentId={parent.id}
      edges={data?.stories.edges}
      error={error}
      hasNextPage={data?.stories.pageInfo.hasNextPage}
      onReachEnd={() => startTransition(() => { fetchMore({ variables: { after: data?.stories.pageInfo.endCursor } }); })}
    />
  );
};

export const StoryChapters = (props: StoryChaptersProps) => (
  <Suspense fallback={<Spinner className="my-lg" />}>
    <StoryChaptersContent {...props} />
  </Suspense>
);
