import { cache, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { QUERY_STORY, StoryView } from '@/components/story';
import { ClientOnly } from '@/components/common';
import { Spinner } from '@/components/ui';
import { publicQuery } from '@/lib/apollo/client';
import type { Metadata } from 'next';

export const revalidate = 1;

export function generateStaticParams() {
  return [];
}

const loadStory = cache(async (id: string) => {
  try {
    const { data } = await publicQuery({
      query: QUERY_STORY,
      variables: { filter: { id: { eq: id } } },
    });
    return data?.story ?? null;
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
      <ClientOnly fallback={<Spinner className="mt-sm" />}>
        <StoryView story={{ id }} className="mt-sm" />
      </ClientOnly>
    </Suspense>
  );
}
