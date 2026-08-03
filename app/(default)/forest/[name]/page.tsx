import { cache } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui';
import { initializeApollo, extractSerializableCacheState } from '@/lib/apollo/client';
import { ForestView, QUERY_FOREST } from '@/components/forest';
import { QUERY_STORIES } from '@/components/story';
import { ApolloHydration } from '@/components/apollo/apollo-hydration';
import type { Metadata } from 'next';
import type { ForestQuery } from '@/lib/graphql/generated/graphql';
import type { NormalizedCacheObject } from '@apollo/client';

export const revalidate = 1;

export function generateStaticParams() {
  return [];
}

interface LoadedForest {
  forest: NonNullable<ForestQuery['forest']>;
  cacheState: NormalizedCacheObject;
}

const loadForest = cache(async (name: string): Promise<LoadedForest | null> => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: QUERY_FOREST,
    variables: { filter: { name: { eq: name } }, sort: { membersCount: 'DESC' } },
  });

  if (!data.forest) return null;

  // add forest by id query to the cache, matching ForestView's own re-query by id
  apolloClient.writeQuery({
    query: QUERY_FOREST,
    data,
    variables: { filter: { id: { eq: data.forest.id } } },
  });

  // load forest stories, warming the cache for whatever inside ForestView queries them
  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { forest: { eq: data.forest.id } }, first: 12, sort: { likesCount: 'DESC' } },
  });

  return { forest: data.forest, cacheState: extractSerializableCacheState(apolloClient) };
});

interface ForestPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: ForestPageProps): Promise<Metadata> {
  const { name } = await params;
  const loaded = await loadForest(name);
  if (!loaded) return {};

  return {
    title: `${loaded.forest.name} | Forest | Treefingers`,
    description: `${loaded.forest.name} - ${loaded.forest.excerpt}`,
  };
}

export default async function ForestPage({ params }: ForestPageProps) {
  const { name } = await params;
  const loaded = await loadForest(name);
  if (!loaded) notFound();

  return (
    <Container>
      <ApolloHydration state={loaded.cacheState} />
      <ForestView forest={loaded.forest} />
    </Container>
  );
}
