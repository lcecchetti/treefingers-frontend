import { HttpLink } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { relayStylePagination } from '@apollo/client/utilities';
import { logoutSession } from '@/lib/auth/logout';
import { getLoginUrl } from '@/lib/helper/auth';
import { env } from '@/lib/env';

// these mutations validate a one-off link token of their own (password reset,
// account activation), independent of the session token, so an UNAUTHENTICATED
// error from them doesn't mean the current session is invalid
const AUTH_MUTATIONS_WITH_OWN_TOKEN = ['changePassword', 'activateAccount'];

// centralizes what individual components used to handle ad hoc: if the
// backend rejects the session token itself (not a permission/ownership
// error - those are FORBIDDEN, see backend), clear it and send the user
// to log in again instead of leaving them stuck on broken queries
export const handleAuthError: ErrorLink.ErrorHandler = ({ error, operation }) => {
  if (typeof window === 'undefined') return;
  if (AUTH_MUTATIONS_WITH_OWN_TOKEN.includes(operation.operationName ?? '')) return;
  if (!CombinedGraphQLErrors.is(error)) return;

  const sessionRejected = error.errors.some(
    (graphQLError) => graphQLError.extensions?.code === 'UNAUTHENTICATED'
  );

  if (!sessionRejected) return;
  if (window.location.pathname.startsWith('/auth')) return;

  logoutSession().then(() => {
    window.location.assign(getLoginUrl(window.location.pathname));
  });
};

export const authErrorLink = new ErrorLink(handleAuthError);

export const typePolicies = {
  Query: {
    fields: {
      comments: relayStylePagination(['filter', 'sort']),
      stories: relayStylePagination(['filter', 'sort']),
      forests: relayStylePagination(['filter', 'sort']),
      users: relayStylePagination(['filter', 'sort']),
      notifications: relayStylePagination(['filter', 'sort']),
    },
  },
};

// calling next/headers' cookies() marks the whole route dynamic, even if no
// cookie ends up being sent - so this must stay opt-in per client rather
// than always-on, or it silently breaks static/ISR rendering for any route
// that happens to reuse the RSC client (see the story/forest/user pages)
export function createServerFetch(forwardCookies: boolean): typeof fetch {
  return async (uri, options = {}) => {
    if (forwardCookies && typeof window === 'undefined') {
      const { cookies } = await import('next/headers');
      const cookieHeader = (await cookies()).toString();
      if (cookieHeader) {
        options.headers = { ...options.headers, cookie: cookieHeader };
      }
    }
    return fetch(uri, options);
  };
}

export function makeHttpLink({ forwardCookies = true }: { forwardCookies?: boolean } = {}) {
  return new HttpLink({
    uri: env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    // the auth token lives in an httpOnly cookie set by the backend, sent
    // automatically by the browser; the frontend never reads or attaches it
    // itself. `credentials: 'include'` only means anything to a browser's
    // fetch though - it has no effect on Node's server-side fetch, which has
    // no cookie jar of its own, so an SSR-side query needing auth must
    // forward the visitor's session cookie explicitly or it's silently
    // unauthenticated.
    credentials: 'include',
    fetch: createServerFetch(forwardCookies),
  });
}
