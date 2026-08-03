import { cache } from 'react';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui';
import { initializeApollo, extractSerializableCacheState } from '@/lib/apollo/client';
import { QUERY_USER, UserView } from '@/components/user';
import { QUERY_STORIES } from '@/components/story';
import { ApolloHydration } from '@/components/apollo/apollo-hydration';
import type { Metadata } from 'next';
import type { UserQuery } from '@/lib/graphql/generated/graphql';
import type { NormalizedCacheObject } from '@apollo/client';

export const revalidate = 1;

export function generateStaticParams() {
  return [];
}

interface LoadedUser {
  user: NonNullable<UserQuery['user']>;
  cacheState: NormalizedCacheObject;
}

const loadUser = cache(async (username: string): Promise<LoadedUser | null> => {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: QUERY_USER,
    variables: { filter: { username: { eq: username } } },
  });

  if (!data?.user) return null;

  // add author by id query to the cache, matching UserView's own re-query by id
  apolloClient.writeQuery({
    query: QUERY_USER,
    data: { user: data.user },
    variables: { filter: { id: { eq: data.user.id } }, first: 12 },
  });

  // load author stories, warming the cache for whatever inside UserView queries them
  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { author: { eq: data.user.id }, parent: { eq: null } }, first: 12, sort: { likesCount: 'DESC' } },
  });

  return { user: data.user, cacheState: extractSerializableCacheState(apolloClient) };
});

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  const { username } = await params;
  const loaded = await loadUser(username);
  if (!loaded) return {};

  return {
    title: `${loaded.user.username} | User | Treefingers`,
    description: `${loaded.user.username} - ${loaded.user.bio}`,
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const loaded = await loadUser(username);
  if (!loaded) notFound();

  return (
    <Container>
      <ApolloHydration state={loaded.cacheState} />
      <UserView user={loaded.user} />
    </Container>
  );
}
