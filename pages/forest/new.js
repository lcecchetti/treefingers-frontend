import { DefaultLayout } from 'components/layout';
import { Text, Container } from 'components/ui';
import { PageIntro } from 'components/common';
import { ForestNew } from 'components/forest';

const ForestNewPage = () => {
  return (
    <Container>
      <PageIntro title="New Forest">
        <Text variant="p">I see too much blank space on this page...</Text>
      </PageIntro>
      <ForestNew />
    </Container>
  );
};

ForestNewPage.Layout = DefaultLayout;

export default ForestNewPage;