import { DefaultLayout } from 'components/layout';
import { Text, Container } from 'components/ui';
import { PageIntro } from 'components/common';
import { StoryNew } from 'components/story';

const StoryNewPage = () => {
  return (
    <Container>
      <PageIntro title="New Story">
        <Text variant="p">I see too much blank space on this page...</Text>
      </PageIntro>
      <StoryNew />
    </Container>
  );
};

StoryNewPage.Layout = DefaultLayout;

export default StoryNewPage;