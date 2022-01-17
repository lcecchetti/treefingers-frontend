import { DefaultLayout } from 'components/layout';
import { Container } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { TagView, QUERY_TAG, QUERY_TAGS } from 'components/tag';
import { QUERY_STORIES } from 'components/story';

const TagPage = ({ tag }) => {
  return (
    <Container>
      <TagView _id={tag._id} />
    </Container>
  );
};

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();

  // load tag by slug
  const { data } = await apolloClient.query({
    query: QUERY_TAG,
    variables: { filter: { slug: { eq: params.slug } } },
  });

  // check if tag exists
  if (!data.tag) {
    return {
      notFound: true,
    }
  }

  // add tag by id query to the cache
  apolloClient.writeQuery({
    query: QUERY_TAG,
    data,
    variables: { filter: { _id: { eq: data.tag._id } } },
  });

  // load tag stories
  await apolloClient.query({
    query: QUERY_STORIES,
    variables: { filter: { tags: { in: [data.tag._id] }, root: null } },
  });

  return addApolloState(apolloClient, {
    props: { tag: data.tag },
    revalidate: 1,
  });
}

export async function getStaticPaths() {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({ query: QUERY_TAGS });

  return {
    paths: data?.tags.edges.map(({ node }) => ({ params: { slug: node.slug } })) || [],
    fallback: 'blocking',
  };
}

TagPage.Layout = DefaultLayout;

export default TagPage;