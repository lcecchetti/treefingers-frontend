import { DefaultLayout } from 'components/layout';
import { Container, Text } from 'components/ui';
import { initializeApollo, addApolloState } from 'lib/apollo/client';
import { TagView, QUERY_TAG, QUERY_TAGS, QUERY_TAGS_BY_SLUG } from 'components/tag';
import { QUERY_STORIES } from 'components/story';

const TagPage = ({ tag }) => {
  return (
    <Container>
      <TagView id={tag.id} />
    </Container>
  );
};

export async function getStaticProps({ params }) {
  const apolloClient = initializeApollo();

  // load tag by slug
  const { data } = await apolloClient.query({
    query: QUERY_TAGS_BY_SLUG,
    variables: { slug: params.tag },
  });

  // check if tag exists
  if (!data.tags.length) {
    return {
      notFound: true,
    }
  }

  const tag = data.tags[0];

  // add tag by id query to the cache
  apolloClient.writeQuery({
    query: QUERY_TAG,
    data: { tag },
    variables: { id: tag.id },
  });

  // add tag stories query to the cache
  apolloClient.writeQuery({
    query: QUERY_STORIES,
    data: { stories: tag.stories },
    variables: { where: { tag: tag.id } },
  });

  return addApolloState(apolloClient, {
    props: { tag },
    revalidate: 1,
  });
}

export async function getStaticPaths() {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({ query: QUERY_TAGS });

  return {
    paths: data.tags.map((tag) => ({ params: { tag: tag.slug } })) || [],
    fallback: 'blocking',
  };
}

TagPage.Layout = DefaultLayout;

export default TagPage;