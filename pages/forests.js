import { DefaultLayout } from 'components/layout';
import { Container, Text, Link, Button } from 'components/ui';
import { ForestList } from 'components/forest';
import { QUERY_FORESTS } from 'components/forest/ForestList';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';
import { FaTree } from 'react-icons/fa';
import { getForestNewUrl } from 'lib/helper/forest';

const ForestsPage = () => {
  return (
    <Container>
      <PageIntro>
        <div className="flex flex-col sm:flex-row sm:gap-sm sm:justify-between">
          <Text variant="pageTitle">Forests</Text>
          <Button as={Link} href={getForestNewUrl()} icon={FaTree}>Create a forest</Button>
        </div>
        <Text variant="p">Be careful, you might get lost in here...</Text>
      </PageIntro>
      <ForestList />
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_FORESTS,
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

ForestsPage.Layout = DefaultLayout;

export default ForestsPage;