import { DefaultLayout } from 'components/layout';
import { Text, Container } from 'components/ui';
import { PageIntro } from 'components/common';
import { ForestNew } from 'components/forest';

const ForestNewPage = () => {
  return (
    <Container>
      <PageIntro>
        <Text variant="pageTitle">New forest</Text>
        <Text variant="p">
          A forest is a place where to grow your stories and a community to take care of them. You can name it by interest, or it can a be a completely original name.
          <br/>
          One rule, keep it unique.
        </Text>
      </PageIntro>
      <ForestNew />
    </Container>
  );
};

ForestNewPage.Layout = DefaultLayout;

export default ForestNewPage;