import { DefaultLayout } from 'components/layout';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { QUERY_STORIES, QUERY_STORY, StoryView } from 'components/story';
import Head from 'next/head';

const StoryPage = ({ story }) => {
  return (
    <>
      <Head>
        <title>{story.title} | Story | Treefingers</title>
        <meta name="description" content={`${story.title} - ${story.excerpt}`} />
      </Head>
      <StoryView story={story} className="mt-sm" />
    </>
  );
};

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();

  // load story by id
  let result;
  
  try {
    result = await apolloClient.query({
      query: QUERY_STORY,
      variables: { filter: { id: { eq: params.id } } },
    });
  } catch(e) {
    return {
      notFound: true,
      revalidate: 1,
    }
  }

  const { data } = result;

  // check if story exists
  if (!data.story) {
    return {
      notFound: true,
      revalidate: 1,
    }
  }

  // load story chapters
  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { 
      filter: { parent: { eq: data.story.id } }, 
      sort: { likesCount: 'DESC' },
      first: 10, 
    },
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