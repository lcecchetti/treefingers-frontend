import { cache, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { QUERY_STORIES, QUERY_STORY, StoryView, StoryContent, StoryContent_StoryFragment } from '@/components/story';
import { ClientOnly } from '@/components/common';
import { Container, Spinner } from '@/components/ui';
import { getPublicClient, publicQuery } from '@/lib/apollo/client';
import { formatDate, DATE_LONG } from '@/lib/helper/date';
import { useFragment } from '@/lib/graphql/generated';
import type { Metadata } from 'next';

export const revalidate = 3600;

// prebuild the most popular root stories at build time; any other story is
// still reachable and gets generated on its first request, then cached for
// `revalidate` seconds (dynamicParams defaults to true)
export async function generateStaticParams() {
  const { data } = await getPublicClient().query({
    query: QUERY_STORIES,
    variables: { filter: { parent: { eq: null } }, sort: { likesCount: 'DESC' }, first: 20 },
  });

  return data?.stories.edges?.map(({ node }) => ({ id: node.id })) ?? [];
}

const loadStory = cache(async (id: string) => {
  try {
    const { data } = await publicQuery({
      query: QUERY_STORY,
      variables: { filter: { id: { eq: id } } },
    });
    return data?.story ? useFragment(StoryContent_StoryFragment, data.story) : null;
  } catch {
    return null;
  }
});

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const story = await loadStory(id);
  if (!story) notFound();

  return {
    title: `${story.title} | Story | Treefingers`,
    description: `${story.title} - ${story.excerpt}`,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const story = await loadStory(id);
  if (!story) notFound();

  return (
    <Suspense fallback={<Spinner className="mt-sm" />}>
      <ClientOnly fallback={
        <Container className="flex justify-end mt-sm">
          <div className="w-full lg:w-1/2 z-10 mb-xl">
            <div className="flex flex-col gap-md">
              <StoryContent story={story} createdAt={formatDate(story.createdAt, DATE_LONG, { timeZone: 'UTC' })} />
            </div>
          </div>
        </Container>
      }>
        <StoryView storyId={id} className="mt-sm" />
      </ClientOnly>
    </Suspense>
  );
}
