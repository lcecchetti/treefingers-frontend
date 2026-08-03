import { describe, it, expect } from 'vitest';
import { useQuery } from '@apollo/client';
import { render, screen } from '@testing-library/react';
import { QUERY_CURRENT_USER } from '@/lib/auth/current-user';
import { initializeApollo } from '@/lib/apollo/client';
import { ApolloProvider } from '@apollo/client';
import { ApolloHydration } from './apollo-hydration';

const Reader = () => {
  const { data, loading } = useQuery(QUERY_CURRENT_USER, { fetchPolicy: 'cache-only' });
  if (loading) return <div>loading</div>;
  return <div>{data?.currentUser?.username ?? 'none'}</div>;
};

describe('ApolloHydration', () => {
  it('seeds the Apollo cache with the given state before children read it', () => {
    const seedClient = initializeApollo();
    seedClient.writeQuery({ query: QUERY_CURRENT_USER, data: { currentUser: { id: '1', email: 'a@b.com', username: 'alice' } } });
    const state = seedClient.cache.extract();

    render(
      <ApolloProvider client={seedClient}>
        <ApolloHydration state={state} />
        <Reader />
      </ApolloProvider>
    );

    expect(screen.getByText('alice')).toBeInTheDocument();
  });
});
