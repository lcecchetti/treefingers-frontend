import { cache } from 'react';
import { notFound } from 'next/navigation';
import { initializeApollo, extractSerializableCacheState } from '@/lib/apollo/client';
import { QUERY_STORIES, QUERY_STORY, StoryView } from '@/components/story';
import { ApolloHydration } from '@/components/apollo/apollo-hydration';
import type { Metadata } from 'next';
import type { StoryQuery } from '@/lib/graphql/generated/graphql';
import type { NormalizedCacheObject } from '@apollo/client';

export const revalidate = 1;

export function generateStaticParams() {
  return [];
}

interface LoadedStory {
  story: NonNullable<StoryQuery['story']>;
  cacheState: NormalizedCacheObject;
}

const loadStory = cache(async (id: string): Promise<LoadedStory | null> => {
  const apolloClient = initializeApollo();

  let result;
  try {
    result = await apolloClient.query({
      query: QUERY_STORY,
      variables: { filter: { id: { eq: id } } },
    });
  } catch {
    return null;
  }

  if (!result.data.story) return null;

  // load story chapters, warming the cache for StoryChapters' own query
  await apolloClient.query({
    query: QUERY_STORIES,
    variables: {
      filter: { parent: { eq: result.data.story.id } },
      sort: { likesCount: 'DESC' },
      first: 10,
    },
  });

  return { story: result.data.story, cacheState: extractSerializableCacheState(apolloClient) };
});

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const loaded = await loadStory(id);
  if (!loaded) return {};

  return {
    title: `${loaded.story.title} | Story | Treefingers`,
    description: `${loaded.story.title} - ${loaded.story.excerpt}`,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const loaded = await loadStory(id);
  if (!loaded) notFound();

  return (
    <>
      <ApolloHydration state={loaded.cacheState} />
      <StoryView story={loaded.story} className="mt-sm" />
    </>
  );
}
