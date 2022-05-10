const getSearchUrl = (q = '') => {
  if (q) {
    q = `?q=${q}`;
  }
  return `/search${q}`;
};

export { getSearchUrl };