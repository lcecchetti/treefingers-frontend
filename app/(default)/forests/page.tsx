import { Container, Text, Link, Button } from '@/components/ui';
import { QUERY_FORESTS, ForestList } from '@/components/forest';
import { initializeApollo, extractSerializableCacheState } from '@/lib/apollo/client';
import { PageIntro } from '@/components/common';
import { ApolloHydration } from '@/components/apollo/apollo-hydration';
import { FaTree } from 'react-icons/fa';
import { getForestNewUrl } from '@/lib/helper/forest';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forests | Treefingers',
  description: 'A list of the most popular forests on Treefingers',
};

export const revalidate = 1;

export default async function ForestsPage() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_FORESTS,
    variables: { first: 12, sort: { membersCount: 'DESC' } },
  });

  return (
    <Container>
      <ApolloHydration state={extractSerializableCacheState(apolloClient)} />
      <PageIntro>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">Forests</Text>
          <Button as={Link} href={getForestNewUrl()} icon={FaTree}>Create</Button>
        </div>
        <Text variant="p">
          Forests are places to group stories — have a look around or create your own.
        </Text>
      </PageIntro>
      <ForestList className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-md" sort={{ membersCount: 'DESC' }} />
    </Container>
  );
}
