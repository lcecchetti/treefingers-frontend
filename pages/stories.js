import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { StoryList } from 'components/story';
import { QUERY_STORIES } from 'components/story/StoryList';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';
import { QUERY_AUTHORS_POPULAR } from 'components/author/PopularAuthors';
import { QUERY_TAGS_POPULAR } from 'components/tag/PopularTags';
import { PopularTags } from 'components/tag';


const StoriesPage = () => {
  return (
    <Container>
      <PageIntro title="Stories">
        <Text variant="p">Looking for some good reads? Here is a good place to start.</Text>
      </PageIntro>
      <div className="flex flex-col gap-md">
        <PopularTags />
        <StoryList filter={{ root: null }} />
      </div>
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { root: null } },
  });

  await apolloClient.query({
    query: QUERY_AUTHORS_POPULAR,
  });

  await apolloClient.query({
    query: QUERY_TAGS_POPULAR,
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

StoriesPage.Layout = DefaultLayout;

export default StoriesPage;