/**
 * Get author url
 * @param {Story} story
 * @return {string}
 */
const getAuthorUrl = (author) => {
  const slug = author.username ?? author.slug;
  const link = `/author/${slug}`;
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