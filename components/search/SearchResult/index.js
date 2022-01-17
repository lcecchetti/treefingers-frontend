import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { getStoryNewUrl } from 'lib/helper/story';
import { Spinner, Link, Text, Button } from 'components/ui';
import { ApiError } from 'components/common';
import { StoryCard, FRAGMENT_STORY_CARD_FIELDS } from 'components/story';
import { AuthorCard, FRAGMENT_AUTHOR_CARD_FIELDS } from 'components/author';
import { TagList } from 'components/tag';

const QUERY_SEARCH = gql`
  query search($query: String!) {
    search(query: $query) {
      stories {
        edges {
          node {
            ...StoryCardFields
          }
        }
      }
      authors {
        edges {
          node {
            ...AuthorCardFields
          }
        }
      }
      tags {
        edges {
          node {
            _id
            slug
            label
          }
        }
      }
    }
  }  
  ${FRAGMENT_STORY_CARD_FIELDS}
  ${FRAGMENT_AUTHOR_CARD_FIELDS}
`;

const SearchResult = ({ className, query }) => {

  const { data, loading, error } = useQuery(QUERY_SEARCH, { variables: { query }, skip: !query });

  return (
    <div className={clsx('', className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {
        data?.search.stories?.length === 0 && data?.search.authors.length === 0 && data?.search.tags?.length === 0 &&
          <>
            <Text variant="p">No one wrote anything regarding {query}. Not yet...</Text>
            <Button as={Link} href={getStoryNewUrl()}>Let's do something about it</Button>
          </>
      }


      <div className="grid md:grid-cols-2 gap-md">
        {!!data?.search.stories?.edges.length && data.search.stories.edges.map(({ node }) => (
          <StoryCard key={node._id} story={node} />
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-md">
        {!!data?.search.authors?.edges.length && data.search.authors.edges.map(({ node }) => (
          <AuthorCard key={node._id} author={node} />
        ))}
      </div>

      <TagList tags={data?.search.tags?.edges.map(({ node }) => node)} />
    </div>
  );
};

export default SearchResult;