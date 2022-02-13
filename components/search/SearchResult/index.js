import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { getForestNewUrl } from 'lib/helper/forest';
import { Spinner, Link, Text, Button } from 'components/ui';
import { ApiError } from 'components/common';
import { StoryCard, FRAGMENT_STORY_CARD_FIELDS } from 'components/story';
import { Avatar } from 'components/user';
import { ForestCard, FRAGMENT_FOREST_CARD_FIELDS } from 'components/forest';

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
            _id
            pseudonym
            username
          }
        }
      }
      forests {
        edges {
          node {
            ...ForestCardFields
          }
        }
      }
    }
  }  
  ${FRAGMENT_STORY_CARD_FIELDS}
  ${FRAGMENT_FOREST_CARD_FIELDS}
`;

const SearchResult = ({ className, query }) => {

  const { data, loading, error } = useQuery(QUERY_SEARCH, { variables: { query }, skip: !query });
  const hasNoResults = data && data.search.stories.edges.length === 0 && data.search.authors.edges.length === 0 && data.search.forests.edges.length === 0;

  return (
    <div className={clsx('', className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {hasNoResults &&
        <>
          <Text variant="p">No one wrote anything regarding {query}. Not yet...</Text>
          <Button as={Link} href={getForestNewUrl()}>Let's do something about it</Button>
        </>
      }

      {data &&
        <div className="flex flex-col gap-md">
          {!!data.search.authors.edges.length &&
            <div className="flex flex-row flex-wrap gap-sm">
              {data.search.authors.edges.map(({ node }) => (
                <Avatar key={node._id} user={node} showName={true} />
              ))}
            </div>
          }

          {!!data.search.forests.edges.length &&
            <div>
              <Text variant="h2" as="h3">Forests</Text>
              <div className="grid md:grid-cols-2 gap-md">
                {data.search.forests.edges.map(({ node }) => (
                  <ForestCard key={node._id} forest={node} />
                ))}
              </div>
            </div>
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
        </div>
      }

    </div>
  );
};

export default SearchResult;