/**
 * Get author url
 * @param {Story} story
 * @return {string}
 */
const getAuthorUrl = (author) => {
  const link = '/author/' + author.username;
  return link;
};

/**
 * Get authors url
 * @return {string}
 */
const getAuthorsUrl = () => {
  return '/authors';
};

export { getAuthorUrl, getAuthorsUrl };