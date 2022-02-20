import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { StoryList, QUERY_STORIES } from 'components/story';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';

const StoriesPage = () => {
  return (
    <Container>
      <PageIntro>
        <Text variant="pageTitle">Stories</Text>
        <Text variant="p">Looking for some good reads? Here is a good place to start.</Text>
      </PageIntro>
      <div className="flex flex-col gap-md">
        <StoryList filter={{ root: null }} />
      </div>
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { root: null }, first: 10 },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

StoriesPage.Layout = DefaultLayout;

export default StoriesPage;