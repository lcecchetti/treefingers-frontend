import { DefaultLayout } from 'components/layout';
import { Container, Text, Link } from 'components/ui';
import { ForestList } from 'components/forest';
import { QUERY_FORESTS } from 'components/forest/ForestList';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';
import { FaPenFancy } from 'react-icons/fa';
import { getForestNewUrl } from 'lib/helper/forest';

const ForestsPage = () => {
  return (
    <Container>
      <PageIntro title="Forests">
        <Text variant="p">Be careful, you might get lost in here...</Text>
        <ul className="flex flex-row gap-sm justify-end text-2xl absolute right-0 top-0">
          <li><Link href={getForestNewUrl()}><FaPenFancy /></Link></li>
        </ul>
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