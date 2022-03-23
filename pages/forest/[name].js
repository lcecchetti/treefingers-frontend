import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { ForestView, QUERY_FOREST } from 'components/forest';
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

  // load forest by name
  const { data } = await apolloClient.query({
    query: QUERY_FOREST,
    variables: { filter: { name: { eq: params.name } } },
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
    variables: { filter: { forest: { eq: data.forest._id } }, first: 10 },
  });

  return addApolloState(apolloClient, {
    props: { forest: data.forest },
    revalidate: 1,
  });
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

ForestPage.Layout = DefaultLayout;

export default ForestPage;