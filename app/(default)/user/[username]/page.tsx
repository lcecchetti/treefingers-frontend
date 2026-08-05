import { cache, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Container, Spinner } from '@/components/ui';
import { ClientOnly } from '@/components/common';
import { getPublicClient, publicQuery } from '@/lib/apollo/client';
import { QUERY_USER, QUERY_USERS, UserView, UserContent, UserContent_UserFragment } from '@/components/user';
import { StoryListStatic } from '@/components/story/story-list-static';
import { useFragment } from '@/lib/graphql/generated';
import type { Metadata } from 'next';

export const revalidate = 3600;

// prebuild the most popular authors at build time; any other user is still
// reachable and gets generated on its first request, then cached for
// `revalidate` seconds (dynamicParams defaults to true)
export async function generateStaticParams() {
  const { data } = await getPublicClient().query({
    query: QUERY_USERS,
    variables: { filter: { storiesCount: { gt: 0 } }, sort: { followersCount: 'DESC' }, first: 20 },
  });

  return data?.users.edges?.map(({ node }) => ({ username: node.username })) ?? [];
}

const loadUser = cache(async (username: string) => {
  const { data } = await publicQuery({
    query: QUERY_USER,
    variables: { filter: { username: { eq: username } } },
  });

  return useFragment(UserContent_UserFragment, data?.user) ?? null;
});

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: UserPageProps): Promise<Metadata> {
  const { username } = await params;
  const user = await loadUser(username);
  if (!user) return {};

  return {
    title: `${user.username} | User | Treefingers`,
    description: `${user.username} - ${user.bio}`,
  };
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const user = await loadUser(username);
  if (!user) notFound();

  return (
    <Container>
      <Suspense fallback={<Spinner className="my-lg" />}>
        <ClientOnly fallback={
          <>
            <UserContent user={user} />
            <StoryListStatic className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md" filter={{ author: { eq: user.id }, parent: { eq: null } }} sort={{ likesCount: 'DESC' }} />
          </>
        }>
          <UserView userId={user.id} />
        </ClientOnly>
      </Suspense>
    </Container>
  );
}
