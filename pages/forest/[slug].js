import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { ForestView, QUERY_FOREST, QUERY_FORESTS } from 'components/forest';
import { QUERY_STORIES } from 'components/story';

const ForestPage = ({ forest }) => {
  return (
    <Container>
      <ForestView _id={forest._id} />
    </Container>
  );
};

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();

  // load forest by slug
  const { data } = await apolloClient.query({
    query: QUERY_FOREST,
    variables: { filter: { slug: { eq: params.slug } } },
  });

  // check if forest exists
  if (!data.forest) {
    return {
      notFound: true,
    }
  }

  // add forest by id query to the cache
  apolloClient.writeQuery({
    query: QUERY_FOREST,
    data,
    variables: { filter: { _id: { eq: data.forest._id } } },
  });

  // load forest stories
  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { forest: { eq: data.forest._id } } },
  });

  return addApolloState(apolloClient, {
    props: { forest: data.forest },
    revalidate: 1,
  });
}

export async function getStaticPaths() {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({ query: QUERY_FORESTS });

  return {
    paths: data?.forests.edges.map(({ node }) => ({ params: { slug: node.slug } })) || [],
    fallback: 'blocking',
  };
}

ForestPage.Layout = DefaultLayout;

export default ForestPage;