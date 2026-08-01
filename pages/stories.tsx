import { DefaultLayout } from 'components/layout';
import { Container, Text, Button, Link } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';
import { StoryList, QUERY_STORIES } from 'components/story';
import { getStoryNewUrl } from 'lib/helper/story';
import { FaTree } from 'react-icons/fa';
import Head from 'next/head';
import type { GetStaticProps } from 'next';
import type { NextPageWithLayout } from 'lib/types/next';

const StoriesPage: NextPageWithLayout = () => {
  return (
    <Container>
      <Head>
        <title>Stories | Treefingers</title>
        <meta name="description" content="A list of the most popular stories on Treefingers"/>
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
      <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md" filter={{ parent: { eq: null } }} sort={{ likesCount: 'DESC' }}/>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { parent: { eq: null } }, first: 12, sort: { likesCount: 'DESC' } },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

StoriesPage.Layout = DefaultLayout;

export default StoriesPage;
