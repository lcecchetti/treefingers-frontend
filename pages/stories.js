import { DefaultLayout } from 'components/layout';
import { Container, Text, Button, Link } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { PageIntro } from 'components/common';
import { StoryList, QUERY_STORIES } from 'components/story';
import { getStoryNewUrl } from 'lib/helper/story';
import { FaTree } from 'react-icons/fa';

const StoriesPage = () => {
  return (
    <Container>
      <PageIntro>
        <div className="flex gap-sm justify-between items-center text-center">
          <Text variant="pageTitle">Stories</Text>
          <Button as={Link} href={getStoryNewUrl()} icon={FaTree}>Plant a story</Button>
        </div>
        <Text variant="p">
          Here is a list of popular stories.
        </Text>
      </PageIntro>
      <StoryList className="grid xl:grid-cols-3 md:grid-cols-2 gap-md" filter={{ root: null}} sort={{ likesCount: 'DESC' }} />
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { root: null }, first: 10, sort: { likesCount: 'DESC' } },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
}

StoriesPage.Layout = DefaultLayout;

export default StoriesPage;