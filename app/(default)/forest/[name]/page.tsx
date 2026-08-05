import { cache, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Container, Spinner } from '@/components/ui';
import { ClientOnly } from '@/components/common';
import { getPublicClient, publicQuery } from '@/lib/apollo/client';
import { ForestView, ForestContent, ForestContent_ForestFragment, QUERY_FOREST, QUERY_FORESTS } from '@/components/forest';
import { StoryListStatic } from '@/components/story/story-list-static';
import { useFragment } from '@/lib/graphql/generated';
import type { Metadata } from 'next';

export const revalidate = 3600;

// prebuild the most popular forests at build time; any other forest is
// still reachable and gets generated on its first request, then cached for
// `revalidate` seconds (dynamicParams defaults to true). A transient backend
// error here must not fail the whole build - fall back to generating no
// params up front and let every forest render on-demand instead (mirrors
// loadForest's per-request error handling below)
export async function generateStaticParams() {
  try {
    const { data } = await getPublicClient().query({
      query: QUERY_FORESTS,
      variables: { sort: { membersCount: 'DESC' }, first: 20 },
    });

    return data?.forests.edges?.map(({ node }) => ({ name: node.name })) ?? [];
  } catch {
    return [];
  }
}

const loadForest = cache(async (name: string) => {
  const { data } = await publicQuery({
    query: QUERY_FOREST,
    variables: { filter: { name: { eq: name } } },
  });

  return useFragment(ForestContent_ForestFragment, data?.forest) ?? null;
});

interface ForestPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: ForestPageProps): Promise<Metadata> {
  const { name } = await params;
  const forest = await loadForest(name);
  if (!forest) return {};

  return {
    title: `${forest.name} | Forest | Treefingers`,
    description: `${forest.name} - ${forest.excerpt}`,
  };
}

export default async function ForestPage({ params }: ForestPageProps) {
  const { name } = await params;
  const forest = await loadForest(name);
  if (!forest) notFound();

  return (
    <Container>
      <Suspense fallback={<Spinner className="my-lg" />}>
        <ClientOnly fallback={
          <>
            <ForestContent forest={forest} />
            <StoryListStatic className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md" filter={{ forest: { eq: forest.id } }} sort={{ likesCount: 'DESC' }} />
          </>
        }>
          <ForestView forestId={forest.id} />
        </ClientOnly>
      </Suspense>
    </Container>
  );
}
