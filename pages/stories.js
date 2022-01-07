import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { StoryList, QUERY_STORIES } from 'components/story';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro, Sidebar } from 'components/common';

const StoriesPage = () => {
  return (
    <Container>
      <PageIntro title="Stories">
        <Text variant="p">Looking for some good reads? Here is a good place to start.</Text>
      </PageIntro>
      <div className="flex flex-col md:flex-row gap-md">
        <StoryList filter={{ root: { eq: null } }} className="md:w-3/4"/>
        <Sidebar className="md:w-1/4" />
      </div>
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { root: { eq: null } } },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

StoriesPage.Layout = DefaultLayout;

export default StoriesPage;