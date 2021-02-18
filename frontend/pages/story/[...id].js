import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { gql } from '@apollo/client';
import { StoryView, QUERY_STORY, QUERY_CHAPTERS, defaultQueryChaptersVariables } from 'components/story';
import merge from 'deepmerge';
import { getStoryUrl } from 'lib/helper';

/**
 * Story pages query
 * @type {gql}
 */
const QUERY_STORY_PAGES = gql`
  query stories {
    stories {
      id
      root {
        id
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

  // get story id
  const id =  params.id[params.id.length - 1];

  // load story by id
  const { data } = await apolloClient.query({
    query: QUERY_STORY,
    variables: { id },
  });

  // check if story exists
  if (!data.story || (data.story.root && params.id[0] != data.story.root.id)) {
    return {
      notFound: true,
    }
  }

  // add story chapters to the cache
  apolloClient.writeQuery({
    query: QUERY_CHAPTERS,
    data: { stories: data.story.children },
    variables: merge(defaultQueryChaptersVariables, { where: { parent: data.story.id } }),
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
    paths: data.stories.map((story) => {
      // get parent and child id
      const id = getStoryUrl(story).split('/').slice(2,4);
      return { params: { id } };
    }) || [],
    fallback: 'blocking',
  };
}

StoryPage.Layout = DefaultLayout;

export default StoryPage;