import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { ForestView, QUERY_FOREST } from 'components/forest';
import { QUERY_STORIES } from 'components/story';
import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import type { NextPageWithLayout } from 'lib/types/next';
import type { ForestQuery } from 'lib/graphql/generated/graphql';

interface ForestPageProps {
  forest: NonNullable<ForestQuery['forest']>;
}

const ForestPage: NextPageWithLayout<ForestPageProps> = ({ forest }) => {
  const title = `${forest.name} | Forest | Treefingers`;
  return (
    <Container>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`${forest.name} - ${forest.excerpt}`} />
      </Head>
      <ForestView forest={forest} />
    </Container>
  );
};

export const getStaticProps: GetStaticProps<ForestPageProps, { name: string }> = async ({ params }) => {
  const apolloClient = initializeApollo();

  // load forest by name
  const { data } = await apolloClient.query({
    query: QUERY_FOREST,
    variables: { filter: { name: { eq: params!.name } }, sort: { membersCount: 'DESC' } },
  });

  // check if forest exists
  if (!data.forest) {
    return {
      notFound: true,
      revalidate: 1,
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

ForestPage.Layout = DefaultLayout;

export default ForestPage;
