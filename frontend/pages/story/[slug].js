import { DefaultLayout } from 'components/layout';
import { Text, Container } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { StoryView, QUERY_STORIES, QUERY_STORY_BY_SLUG, QUERY_STORY } from 'components/story';
import { getStoryUrl } from 'lib/helper/story';

const StoryPage = ({ story }) => {
  return (
    <Container>
      <StoryView id={story.id} />
    </Container>
  );
};

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();

  // load story by slug
  const { data } = await apolloClient.query({
    query: QUERY_STORY_BY_SLUG,
    variables: { slug: params.slug },
  },);

  // add story by id query to the cache
  apolloClient.writeQuery({
    query: QUERY_STORY,
    data: { story: data.storyBySlug },
    variables: { id: data.storyBySlug.id },
  });

  return addApolloState(apolloClient, {
    props: { story: data.storyBySlug},
    revalidate: 1,
  });
}

export async function getStaticPaths() {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({ query: QUERY_STORIES });

  return {
    paths: data.stories.map((story) => getStoryUrl(story)) || [],
    fallback: true,
  };
}

StoryPage.Layout = DefaultLayout;

export default StoryPage;