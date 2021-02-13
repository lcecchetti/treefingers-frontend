import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { useRouter } from 'next/router';
import { PageIntro } from 'components/common';

const SearchPage = () => {
  const router = useRouter();

  return (
    <Container>
      <PageIntro title="Search">
        <Text variant="p">Here is all we could find for {router.query.q}.</Text>
      </PageIntro>
    </Container>
  );
};

SearchPage.Layout = DefaultLayout;

export default SearchPage;