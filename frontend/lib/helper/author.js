/**
 * Get author url
 * @param {Story} story
 * @return {string}
 */
const getAuthorUrl = (author) => {
  const link = '/author/' + author.username;
  return link;
};

export { getAuthorUrl };