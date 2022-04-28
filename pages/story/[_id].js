import { DefaultLayout } from 'components/layout';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { QUERY_STORIES, QUERY_STORY, StoryView } from 'components/story';

const StoryPage = ({ story }) => {
  return (
    <StoryView story={story} />
  );
};

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();

  // load story by id
  const { data } = await apolloClient.query({
    query: QUERY_STORY,
    variables: { filter: { _id: { eq: params._id } } },
  });

  // check if story exists
  if (!data.story) {
    return {
      notFound: true,
    }
  }

  // load story chapters
  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { parent: { eq: data.story._id } }, sort: { likesCount: 'DESC' }, first: 10 },
  });

  return addApolloState(apolloClient, {
    props: { story: data.story },
    revalidate: 1,
  });
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

StoryPage.Layout = DefaultLayout;

export default StoryPage;