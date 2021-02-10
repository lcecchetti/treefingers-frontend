import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { StoryList, QUERY_STORIES } from 'components/story';
import { initializeApollo, addApolloState } from 'lib/apollo/client';

const StoriesPage = () => {
  return (
    <Container className="py-md">
      <Text variant="pageTitle">Stories</Text>
      <Text variant="p">Looking for some good reads? Here is a good place to start.</Text>
      <StoryList className="my-md"/>
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