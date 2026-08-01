const MUTATION_LOGOUT = `
  mutation logout {
    logout {
      result
    }
  }
`;

// raw fetch rather than the Apollo client: this needs to work from the
// Apollo error link itself (which can't depend on the client it's part of),
// and all it needs to do is ask the backend to clear the auth cookie
export const logoutSession = async () => {
  try {
    await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: MUTATION_LOGOUT }),
    });
  } catch (e) {
    // best-effort: proceeding to redirect to login is still correct even if this fails
  }
};
