import { Text, Container } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { StoryNew } from '@/components/story';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New story | Treefingers',
  description: 'Plant a new story on Treefingers',
};

interface StoryNewPageProps {
  searchParams: Promise<{ forest?: string }>;
}

export default async function StoryNewPage({ searchParams }: StoryNewPageProps) {
  const { forest } = await searchParams;

  return (
    <Container>
      <PageIntro>
        <Text variant="pageTitle">New story</Text>
        <Text variant="p">
          There is too much blank space on this page, let's fill it!
        </Text>
      </PageIntro>
      <StoryNew forest={forest} />
    </Container>
  );
}
