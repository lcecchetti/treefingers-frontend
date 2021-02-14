import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { getExcerpt, getStoryNewUrl } from 'lib/helper/story';
import { Spinner, Link, Text, Button } from 'components/ui';
import { getSearchResultUrl } from 'lib/helper/search';

const QUERY_SEARCH = gql`
  query search($q: String!) {
    search(q: $q) {
      id
      type
      title
      content
      slug
    }
  }  
`;

const SearchResult = ({ className, query }) => {

  const { data, loading, error } = useQuery(QUERY_SEARCH, { variables: { q: query }, skip: !query });

  return (
    <div className={clsx('', className)}>
      {loading && <Spinner />}

      {error && <Text variant="error">{error.message}</Text>}

      {
        data?.search.length === 0 && 
          <>
            <Text variant="p">No one wrote anything regarding {query}. Not yet...</Text>
            <Button as={Link} href={getStoryNewUrl()} styleAsLink={false}>Let's do something about it</Button>
          </>
      }

      {data?.search && data.search.map((result) => (
        <div key={result.id}>
          <Link href={getSearchResultUrl(result, result.type)} underline={false}>
            <Text variant="h3" className="font-bold">{result.title}</Text>
            <Text variant="p">{getExcerpt(result)}</Text>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchResult;