/**
 * Get author url
 * @param {Story} story
 * @return {string}
 */
const getAuthorUrl = (author) => {
  const url = `/author/${author.username}`;
  return url;
};

/**
 * Get authors url
 * @return {string}
 */
const getAuthorsUrl = () => {
  return '/authors';
};

export { getAuthorUrl, getAuthorsUrl };