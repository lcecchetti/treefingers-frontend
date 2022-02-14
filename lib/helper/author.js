/**
 * Get author url
 * @param {Author} tag
 * @return {string}
 */
const getAuthorUrl = (author) => {
  return `/author/${author.username}`;
};

export { getAuthorUrl };