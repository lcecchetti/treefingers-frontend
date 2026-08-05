import { UserCard } from './user-card';
import { publicQuery } from '@/lib/apollo/client';
import type { UsersQueryVariables } from '@/lib/graphql/generated/graphql';
import { QUERY_USERS } from './user-list.query';

interface UserListStaticProps {
  className?: string;
  filter?: UsersQueryVariables['filter'];
  sort?: UsersQueryVariables['sort'];
  first?: number;
}

// server-rendered, cookie-free counterpart to UserList: used as ClientOnly's
// SSR/first-paint fallback so crawlers and pre-hydration visitors see real
// authors instead of a spinner, while staying ISR-safe (publicQuery never
// calls next/headers cookies()). The live UserList takes over on mount for
// personalization and infinite scroll.
//
// Deliberately NOT exported from ./index - it pulls in the RSC-only
// publicQuery/registerApolloClient chain, which breaks the client bundle if
// re-exported through the same barrel as 'use client' components (see
// lib/apollo/client.ts). Import this file directly from Server Components.
export const UserListStatic = async ({ className, filter, sort, first = 12 }: UserListStaticProps) => {
  const edges = await publicQuery({ query: QUERY_USERS, variables: { filter, sort, first } })
    .then(({ data }) => data?.users.edges ?? [])
    .catch(() => []);

  return edges.length > 0 && (
    <div className={className}>
      {edges.map(({ node }) => (
        <UserCard key={node.id} user={node} />
      ))}
    </div>
  );
};
