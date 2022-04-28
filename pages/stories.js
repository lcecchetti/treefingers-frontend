import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';
import { StoryList, QUERY_STORIES } from 'components/story';

const StoriesPage = () => {
  return (
    <Container>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">Stories</Text>
        </div>
        <Text variant="p">
          Here is a list of popular stories.
        </Text>
      </PageIntro>
      <StoryList sort={{ likesCount: 'DESC' }} />
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { first: 10, sort: { likesCount: 'DESC' } },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

StoriesPage.Layout = DefaultLayout;

export default StoriesPage;