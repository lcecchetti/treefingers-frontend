/**
 * Get author url
 * @param {Author} tag
 * @return {string}
 */
const getAuthorUrl = (author) => {
  return `/author/${author.username}`;
};

/**
 * Get authors url
 * @return {string}
 */
const getAuthorsUrl = () => {
  return '/authors';
};

export { getAuthorUrl, getAuthorsUrl };