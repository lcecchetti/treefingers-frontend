const getSearchUrl = (q: string = ''): string => {
  if (q) {
    q = `?q=${q}`;
  }
  return `/search${q}`;
};

export { getSearchUrl };
