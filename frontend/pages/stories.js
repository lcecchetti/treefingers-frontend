import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { StoryList, QUERY_STORIES } from 'components/story';
import { initializeApollo, addApolloState } from 'lib/apollo/client';

const StoriesPage = () => {
  return (
    <Container>
      <StoryList />
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_STORIES,
  },);

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

StoriesPage.Layout = DefaultLayout;

export default StoriesPage;