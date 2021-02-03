import { DefaultLayout } from 'components/layout';
import { Text, Container } from 'components/ui';
import { StoryList } from 'components/story';

const StoriesPage = () => {
  return (
    <Container>
      <Text variant="pageTitle">Stories</Text>
      <StoryList />
    </Container>
  );
};

StoriesPage.Layout = DefaultLayout;

export default StoriesPage;