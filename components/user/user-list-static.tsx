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

// Server-rendered, cookie-free counterpart to UserList, used as ClientOnly's
// SSR fallback; UserList takes over on mount for personalization/infinite scroll.
//
// Deliberately not exported from ./index -- it pulls in the RSC-only
// publicQuery chain, which breaks the client bundle if re-exported through
// a barrel with 'use client' components. Import this file directly.
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
