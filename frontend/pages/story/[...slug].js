import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { gql } from '@apollo/client';
import { StoryView, QUERY_STORIES_BY_SLUG, QUERY_STORY } from 'components/story';
import { getStoryUrl } from 'lib/helper/story';

/**
 * Story pages query
 * @type {gql}
 */
const QUERY_STORY_PAGES = gql`
  query stories {
    stories {
      id
      slug
      root {
        id 
        slug
      }
    }
  }
`;

const StoryPage = ({ story }) => {
  return (
    <Container>
      <StoryView id={story.id} />
    </Container>
  );
};

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();

  // get slug
  const slug =  params.slug.length > 1 ? params.slug[1] : params.slug[0];

  // load story by slug
  const { data } = await apolloClient.query({
    query: QUERY_STORIES_BY_SLUG,
    variables: { slug },
  });

  const story = data.stories.length && data.stories[0];

  // check if story exists
  if (!story || (story.parent && params.slug[0] != story.root.slug) ) {
    return {
      notFound: true,
    }
  }

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

  const { data } = await apolloClient.query({ query: QUERY_STORY_PAGES });

  return {
    paths: data.stories.map((story) => {
      // get parent and child slug
      const slug = getStoryUrl(story).split('/').slice(2,4);;
      return { params: { slug: slug } };
    }) || [],
    fallback: 'blocking',
  };
}

StoryPage.Layout = DefaultLayout;

export default StoryPage;