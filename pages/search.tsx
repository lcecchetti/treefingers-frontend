import { DefaultLayout } from '@/components/layout';
import { Container, Text } from '@/components/ui';
import { useRouter } from 'next/router';
import { PageIntro } from '@/components/common';
import { SearchResult } from '@/components/search';
import Head from 'next/head';
import type { NextPageWithLayout } from '@/lib/types/next';

const SearchPage: NextPageWithLayout = () => {
  const router = useRouter();

  const query = router.query.q;

  return (
    <Container>
      <Head>
        <title>Search | Treefingers</title>
      </Head>
      <PageIntro>
        <Text variant="p">Here is all we could find for {query}:</Text>
      </PageIntro>
      <SearchResult query={query as string | undefined} />
    </Container>
  );
};

SearchPage.Layout = DefaultLayout;

export default SearchPage;
