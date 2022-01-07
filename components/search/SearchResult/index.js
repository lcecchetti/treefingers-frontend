import { gql, useQuery } from '@apollo/client';
import clsx from 'clsx';
import { getStoryNewUrl } from 'lib/helper/story';
import { getSearchResultUrl } from 'lib/helper/search';
import { Spinner, Link, Text, Button } from 'components/ui';
import { ApiError } from 'components/common';

const QUERY_SEARCH = gql`
  query search($q: String!) {
    search(q: $q) {
      _id
      label
      excerpt
      url
      type
    }
  }  
`;

const SearchResult = ({ className, query }) => {

  const { data, loading, error } = useQuery(QUERY_SEARCH, { variables: { q: query }, skip: !query });

  return (
    <div className={clsx('', className)}>
      <Spinner loading={loading}/>
      <ApiError error={error}/>

      {
        data?.search.length === 0 && 
          <>
            <Text variant="p">No one wrote anything regarding {query}. Not yet...</Text>
            <Button as={Link} href={getStoryNewUrl()}>Let's do something about it</Button>
          </>
      }

      {data?.search && data.search.map((result) => (
        <div key={result._id}>
          <Link href={getSearchResultUrl(result)}>
            <Text variant="h3" className="font-bold">{result.label}</Text>
            <Text variant="p">{result.excerpt}</Text>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchResult;