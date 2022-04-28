import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { PageIntro } from 'components/common';

const AboutPage = () => {
  return (
    <Container>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center">
          <Text variant="pageTitle">About Treefingers</Text>
        </div>
      </PageIntro>
    </Container>
  );
};

AboutPage.Layout = DefaultLayout;

export default AboutPage;