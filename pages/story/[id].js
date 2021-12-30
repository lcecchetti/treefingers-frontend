import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { gql } from '@apollo/client';
import { StoryView, QUERY_STORY, QUERY_CHAPTERS } from 'components/story';
/**
 * Story pages query
 * @type {gql}
 */
const QUERY_STORY_PAGES = gql`
  query stories {
    stories {
      _id
    }
  }
`;

const StoryPage = ({ story }) => {
  return (
    <Container>
      <StoryView story={story} />
    </Container>
  );
};

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();

  // load story by id
  const { data } = await apolloClient.query({
    query: QUERY_STORY,
    variables: { _id: params._id },
  });

  // check if story exists
  if (!data.story) {
    return {
      notFound: true,
    }
  }

  // load story chapters
  await apolloClient.query({
    query: QUERY_CHAPTERS,
    data: { stories: data.story.children },
    variables: { where: { parent: data.story._id } },
  });

  return addApolloState(apolloClient, {
    props: { story: data.story },
    revalidate: 1,
  });
}

export async function getStaticPaths() {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({ query: QUERY_STORY_PAGES });

  return {
    paths: data.stories.map((story) => ({ params: { _id: story._id } }) ) || [],
    fallback: 'blocking',
  };
}

StoryPage.Layout = DefaultLayout;

export default StoryPage;