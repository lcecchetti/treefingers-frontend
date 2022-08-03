import { DefaultLayout } from 'components/layout';
import { Text, Container } from 'components/ui';
import { PageIntro } from 'components/common';
import { StoryNew } from 'components/story';
import { useRouter } from 'next/router';
import Head from 'next/head';

const StoryNewPage = () => {
  const router = useRouter();
  return (
    <Container>
      <Head>
        <title>New story | Treefingers</title>
        <meta name="description" content="Plant a new story on Treefingers" />
      </Head>
      <PageIntro>
        <Text variant="pageTitle">New story</Text>
        <Text variant="p">
          There is too much blank space on this page, let's fill it!
        </Text>
      </PageIntro>
      <StoryNew forest={router.query.forest} />
    </Container>
  );
};

StoryNewPage.Layout = DefaultLayout;

export default StoryNewPage;