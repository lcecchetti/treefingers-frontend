/**
 * Get search url
 * @return {string}
 */
const getSearchUrl = (q = '') => {
  if (q) {
    q = `?q=${q}`;
  }
  return `/search${q}`;
};

export { getSearchUrl };