import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { getStoryNewUrl } from 'lib/helper/story';
import { Spinner, Link, Text, Button } from 'components/ui';
import { ApiError } from 'components/common';
import { StoryCard } from 'components/story';
import { FRAGMENT_STORY_CARD_FIELDS } from 'components/story/StoryCard';
import { AuthorCard } from 'components/author';
import { FRAGMENT_AUTHOR_CARD_FIELDS } from 'components/author/AuthorCard';
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
  const hasNoResults = data && data.search.stories.edges.length === 0 && data.search.authors.edges.length === 0 && data.search.tags.edges.length === 0;

  return (
    <div className={clsx('', className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {hasNoResults &&
        <>
          <Text variant="p">No one wrote anything regarding {query}. Not yet...</Text>
          <Button as={Link} href={getStoryNewUrl()}>Let's do something about it</Button>
        </>
      }



      {data &&
        <div className="flex flex-col gap-md">
          {!!data.search.tags.edges.length &&
            <TagList tags={data?.search.tags?.edges.map(({ node }) => node)} />
          }

          {!!data.search.stories.edges.length &&
            <div>
              <Text variant="h2" as="h3">Stories</Text>
              <div className="grid md:grid-cols-2 gap-md">
                {data.search.stories.edges.map(({ node }) => (
                  <StoryCard key={node._id} story={node} />
                ))}
              </div>
            </div>
          }

          {!!data.search.authors.edges.length &&
            <div>
              <Text variant="h2" as="h3">Authors</Text>
              <div className="grid md:grid-cols-2 gap-md">
                {data.search.authors.edges.map(({ node }) => (
                  <AuthorCard key={node._id} author={node} />
                ))}
              </div>
            </div>
          }
        </div>
      }

    </div>
  );
};

export default SearchResult;