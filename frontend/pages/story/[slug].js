import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { StoryView, QUERY_STORIES, QUERY_STORIES_BY_SLUG, QUERY_STORY } from 'components/story';

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
    query: QUERY_STORIES_BY_SLUG,
    variables: { slug: params.slug },
  });

  // check if story exists
  if (!data.stories.length) {
    return {
      notFound: true,
    }
  }

  const story = data.stories[0];

  // add story by id query to the cache
  apolloClient.writeQuery({
    query: QUERY_STORY,
    data: { story },
    variables: { id: story.id },
  });

  return addApolloState(apolloClient, {
    props: { story},
    revalidate: 1,
  });
}

export async function getStaticPaths() {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({ query: QUERY_STORIES });

  return {
    paths: data.stories.map((story) => ({ params: { slug: story.slug } })) || [],
    fallback: 'blocking',
  };
}

StoryPage.Layout = DefaultLayout;

export default StoryPage;