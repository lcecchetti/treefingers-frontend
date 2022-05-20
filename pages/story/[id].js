import { DefaultLayout } from 'components/layout';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { QUERY_STORIES, QUERY_STORY, StoryView } from 'components/story';
import Head from 'next/head';

const StoryPage = ({ story }) => {
  return (
    <>
      <Head>
        <title>{story.title} | Story | Treefingers</title>
      </Head>
      <StoryView story={story} className="mt-sm" />
    </>
  );
};

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();

  // load story by id
  const { data } = await apolloClient.query({
    query: QUERY_STORY,
    variables: { filter: { id: { eq: params.id } } },
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
    variables: { filter: { parentId: { eq: data.story.id } }, first: 10 },
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