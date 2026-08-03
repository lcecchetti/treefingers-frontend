import { Text, Container } from '@/components/ui';
import { PageIntro } from '@/components/common';
import { ForestNew } from '@/components/forest';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'New forest | Treefingers',
  description: 'Create a new forest on Treefingers - A forest is a place to group stories.',
};

export default function ForestNewPage() {
  return (
    <Container>
      <PageIntro>
        <Text variant="pageTitle">New forest</Text>
        <Text variant="p">
          A forest is a place to group stories.<br/>
          You can name it by interest, or it can be a completely original name.<br/>
          One rule, keep it unique.
        </Text>
      </PageIntro>
      <ForestNew />
    </Container>
  );
}
