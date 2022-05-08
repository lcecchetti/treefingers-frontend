import { DefaultLayout } from 'components/layout';
import { Text, Container } from 'components/ui';
import { PageIntro } from 'components/common';
import { StoryNew } from 'components/story';
import { useRouter } from 'next/router';

const StoryNewPage = () => {
  const router = useRouter();
  return (
    <Container>
      <PageIntro>
        <Text variant="pageTitle">New story</Text>
        <Text variant="p">
          There is too much blank space on this page, let's fill it!<br/>
          You'll need to pick a forest where to plant your story.<br/>
          Forests are containers and communities that group stories.
        </Text>
      </PageIntro>
      <StoryNew forest={router.query.forest} />
    </Container>
  );
};

StoryNewPage.Layout = DefaultLayout;

export default StoryNewPage;