import { DefaultLayout } from 'components/layout';
import { Container, Text, Link } from 'components/ui';
import { ForestList } from 'components/forest';
import { QUERY_FORESTS } from 'components/forest/ForestList';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';
import { FaSeedling } from 'react-icons/fa';
import { getForestNewUrl } from 'lib/helper/forest';

const ForestsPage = () => {
  return (
    <Container>
      <PageIntro title="Forests">
        <div className="flex justify-between">
          <Text variant="p">Be careful, you might get lost in here...</Text>
          <Link href={getForestNewUrl()}><FaSeedling className="text-2xl" /></Link>
        </div>

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