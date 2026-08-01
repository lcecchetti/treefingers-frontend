import { DefaultLayout } from '@/components/layout';
import { Container, Text } from '@/components/ui';
import { initializeApollo, addApolloState } from '@/lib/apollo/client';
import { PageIntro } from '@/components/common';
import { UserList, QUERY_USERS } from '@/components/user';
import Head from 'next/head';
import type { GetStaticProps } from 'next';
import type { NextPageWithLayout } from '@/lib/types/next';

const AuthorsPage: NextPageWithLayout = () => {
  return (
    <Container>
      <Head>
        <title>Authors | Treefingers</title>
        <meta name="description" content="A list of the most popular authors on Treefingers"/>
      </Head>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">Authors</Text>
        </div>
        <Text variant="p">
          Here is a list of popular authors.
        </Text>
      </PageIntro>
      <UserList className="grid gap-md xl:grid-cols-3 md:grid-cols-2 grid-cols-1" filter={{ storiesCount: { gt: 0 } }} sort={{ followersCount: 'DESC' }} />
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_USERS,
    variables: { first: 12, filter: { storiesCount: { gt: 0 } }, sort: { followersCount: 'DESC' } },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

AuthorsPage.Layout = DefaultLayout;

export default AuthorsPage;
