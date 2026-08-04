import { cache, Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Container, Spinner } from '@/components/ui';
import { publicQuery } from '@/lib/apollo/client';
import { ForestView, QUERY_FOREST } from '@/components/forest';
import type { Metadata } from 'next';

export const revalidate = 1;

export function generateStaticParams() {
  return [];
}

const loadForest = cache(async (name: string) => {
  const { data } = await publicQuery({
    query: QUERY_FOREST,
    variables: { filter: { name: { eq: name } } },
  });

  return data?.forest ?? null;
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
        <ForestView forest={{ id: forest.id, storiesCount: forest.storiesCount }} />
      </Suspense>
    </Container>
  );
}
