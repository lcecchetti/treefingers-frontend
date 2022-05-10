import { DefaultLayout } from 'components/layout';
import { Text, Container } from 'components/ui';
import { PageIntro } from 'components/common';
import { ForestNew } from 'components/forest';
import Head from 'next/head';

const ForestNewPage = () => {
  return (
    <Container>
      <Head>
        <title>New forest | Treefingers</title>
      </Head>
      <PageIntro>
        <Text variant="pageTitle">New forest</Text>
        <Text variant="p">
          A forest is a place where to group stories.<br/>
          You can name it by interest, or it can a be a completely original name.<br/>
          One rule, keep it unique.
        </Text>
      </PageIntro>
      <ForestNew />
    </Container>
  );
};

ForestNewPage.Layout = DefaultLayout;

export default ForestNewPage;