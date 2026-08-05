import { HttpLink } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { relayStylePagination } from '@apollo/client/utilities';
import { logoutSession } from '@/lib/auth/logout';
import { getLoginUrl } from '@/lib/helper/auth';
import { env } from '@/lib/env';

// These validate a one-off link token, not the session, so their
// UNAUTHENTICATED errors don't mean the current session is invalid.
const AUTH_MUTATIONS_WITH_OWN_TOKEN = ['changePassword', 'activateAccount'];

// If the backend rejects the session token itself (not a permission error --
// those are FORBIDDEN), clear it and send the user to log in again.
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

// cookies() marks the whole route dynamic even if unused, so this must stay
// opt-in per client or it silently breaks static/ISR rendering elsewhere.
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
    // Auth cookie is httpOnly and browser-sent automatically. `credentials:
    // 'include'` only affects browser fetch though -- Node's server-side
    // fetch has no cookie jar, so SSR needs createServerFetch above to forward it.
    credentials: 'include',
    fetch: createServerFetch(forwardCookies),
  });
}
