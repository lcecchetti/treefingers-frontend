import { DefaultLayout } from 'components/layout';
import { Text } from 'components/ui';

const StoryNewPage = () => {
  return (
    <div>
      <Text variant="h1">New story</Text>
    </div>
  );
};

StoryNewPage.Layout = DefaultLayout;

export default StoryNewPage;