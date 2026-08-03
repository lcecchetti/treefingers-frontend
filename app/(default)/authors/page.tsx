import { Container, Text } from '@/components/ui';
import { initializeApollo, extractSerializableCacheState } from '@/lib/apollo/client';
import { PageIntro } from '@/components/common';
import { UserList, QUERY_USERS } from '@/components/user';
import { ApolloHydration } from '@/components/apollo/apollo-hydration';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authors | Treefingers',
  description: 'A list of the most popular authors on Treefingers',
};

export const revalidate = 1;

export default async function AuthorsPage() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_USERS,
    variables: { first: 12, filter: { storiesCount: { gt: 0 } }, sort: { followersCount: 'DESC' } },
  });

  return (
    <Container>
      <ApolloHydration state={extractSerializableCacheState(apolloClient)} />
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
}
