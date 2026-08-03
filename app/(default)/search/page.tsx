import { Container, Text } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { SearchResult } from '@/components/search';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search | Treefingers',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <Container>
      <PageIntro>
        <Text variant="p">Here is all we could find for {q}:</Text>
      </PageIntro>
      <SearchResult query={q} />
    </Container>
  );
}
