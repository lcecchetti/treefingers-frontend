import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { useRouter } from 'next/router';
import { PageIntro } from 'components/common';
import { SearchResult } from 'components/search';

const SearchPage = () => {
  const router = useRouter();

  const query = router.query.q;

  return (
    <Container>
      <PageIntro title="Search">
        <Text variant="p">Here is all we could find for {query}:</Text>
      </PageIntro>
      <SearchResult query={query} />
    </Container>
  );
};

SearchPage.Layout = DefaultLayout;

export default SearchPage;