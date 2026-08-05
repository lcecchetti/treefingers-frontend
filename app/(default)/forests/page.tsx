import { Container, Text, Link, Button } from '@/components/ui';
import { ForestListContent } from '@/components/forest';
import { ForestListStatic } from '@/components/forest/forest-list-static';
import { ClientOnly, PageIntro } from '@/components/common';
import { TreePine } from 'lucide-react';
import { getForestNewUrl } from '@/lib/helper/forest';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forests | Treefingers',
  description: 'A list of the most popular forests on Treefingers',
};

export const revalidate = 3600;

const GRID_CLASS_NAME = 'grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md';

export default function ForestsPage() {
  return (
    <Container>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">Forests</Text>
          <Button as={Link} href={getForestNewUrl()} icon={TreePine}>Create</Button>
        </div>
        <Text variant="p">
          Forests are places to group stories — have a look around or create your own.
        </Text>
      </PageIntro>
      <ClientOnly fallback={<ForestListStatic className={GRID_CLASS_NAME} sort={{ membersCount: 'DESC' }} />}>
        <ForestListContent className={GRID_CLASS_NAME} sort={{ membersCount: 'DESC' }} />
      </ClientOnly>
    </Container>
  );
}
