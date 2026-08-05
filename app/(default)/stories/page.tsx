import { Container, Text, Button, Link } from '@/components/ui';
import { ClientOnly, PageIntro } from '@/components/common';
import { StoryListContent } from '@/components/story';
import { StoryListStatic } from '@/components/story/story-list-static';
import { getStoryNewUrl } from '@/lib/helper/story';
import { TreePine } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stories | Treefingers',
  description: 'A list of the most popular stories on Treefingers',
};

export const revalidate = 3600;

const GRID_CLASS_NAME = 'grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md';

export default function StoriesPage() {
  return (
    <Container>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center text-center">
          <Text variant="pageTitle">Stories</Text>
          <Button as={Link} href={getStoryNewUrl()} icon={TreePine}>Plant</Button>
        </div>
        <Text variant="p">
          Here is a list of popular stories.
        </Text>
      </PageIntro>
      <ClientOnly fallback={<StoryListStatic className={GRID_CLASS_NAME} filter={{ parent: { eq: null } }} sort={{ likesCount: 'DESC' }} />}>
        <StoryListContent className={GRID_CLASS_NAME} filter={{ parent: { eq: null } }} sort={{ likesCount: 'DESC' }}/>
      </ClientOnly>
    </Container>
  );
}
