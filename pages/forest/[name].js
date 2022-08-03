import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { ForestView, QUERY_FOREST } from 'components/forest';
import { QUERY_STORIES } from 'components/story';
import Head from 'next/head';

const ForestPage = ({ forest }) => {
  return (
    <Container>
      <Head>
        <title>{forest.name} | Forest | Treefingers</title>
        <meta name="description" content={`${forest.name} - ${forest.excerpt}`} />
      </Head>
      <ForestView forest={forest} />
    </Container>
  );
};

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();

  // load forest by name
  const { data } = await apolloClient.query({
    query: QUERY_FOREST,
    variables: { filter: { name: { eq: params.name } }, sort: { membersCount: 'DESC' } },
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
    variables: { filter: { id: { eq: data.forest.id } } },
  });

  // load forest stories
  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { forest: { eq: data.forest.id } }, first: 12, sort: { likesCount: 'DESC' } },
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