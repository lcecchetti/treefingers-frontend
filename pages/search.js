import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { useRouter } from 'next/router';
import { PageIntro } from 'components/common';
import { SearchResult } from 'components/search';
import Head from 'next/head';

const SearchPage = () => {
  const router = useRouter();

  const query = router.query.q;

  return (
    <Container>
      <Head>
        <title>Search | Treefingers</title>
      </Head>
      <PageIntro title="Search">
        <Text variant="p">Here is all we could find for {query}:</Text>
      </PageIntro>
      <SearchResult query={query} />
    </Container>
  );
};

SearchPage.Layout = DefaultLayout;

export default SearchPage;