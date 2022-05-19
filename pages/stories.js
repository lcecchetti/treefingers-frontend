import { DefaultLayout } from 'components/layout';
import { Container, Text, Button, Link } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';
import { StoryList, QUERY_STORIES } from 'components/story';
import { getStoryNewUrl } from 'lib/helper/story';
import { FaTree } from 'react-icons/fa';
import Head from 'next/head';

const StoriesPage = () => {
  return (
    <Container>
      <Head>
        <title>Stories | Treefingers</title>
      </Head>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center text-center">
          <Text variant="pageTitle">Stories</Text>
          <Button as={Link} href={getStoryNewUrl()} icon={FaTree}>Plant</Button>
        </div>
        <Text variant="p">
          Here is a list of popular stories.
        </Text>
      </PageIntro>
      <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 gap-md" filter={{ parentId: { eq: null } }} />
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { parentId: { eq: null } }, first: 10 },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

StoriesPage.Layout = DefaultLayout;

export default StoriesPage;