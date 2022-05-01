import { DefaultLayout } from 'components/layout';
import { Container, Text, Link, Button } from 'components/ui';
import { QUERY_FORESTS, ForestList } from 'components/forest';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';
import { FaTree } from 'react-icons/fa';
import { getForestNewUrl } from 'lib/helper/forest';

const ForestsPage = () => {
  return (
    <Container>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">Forests</Text>
          <Button as={Link} href={getForestNewUrl()} icon={FaTree}>Create</Button>
        </div>
        <Text variant="p">
          Forests are places where to group stories, have a look around or create your own.
        </Text>
      </PageIntro>
      <ForestList className="grid xl:grid-cols-3 md:grid-cols-2 gap-md" sort={{ membersCount: 'DESC' }} />
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_FORESTS,
    variables: { first: 10, sort: { membersCount: 'DESC' } },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

ForestsPage.Layout = DefaultLayout;

export default ForestsPage;