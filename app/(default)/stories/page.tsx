import { Container, Text, Button, Link } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { StoryList } from '@/components/story';
import { getStoryNewUrl } from '@/lib/helper/story';
import { TreePine } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stories | Treefingers',
  description: 'A list of the most popular stories on Treefingers',
};

export const revalidate = 1;

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
      <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md" filter={{ parent: { eq: null } }} sort={{ likesCount: 'DESC' }}/>
    </Container>
  );
}
