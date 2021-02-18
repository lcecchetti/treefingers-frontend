/**
 * Get author url
 * @param {Author} tag
 * @return {string}
 */
const getAuthorUrl = (author) => {
  const url = '/author/';
  
  if (author.url) {
    return url + author.url;
  }

  return url + author.username;
};

/**
 * Get authors url
 * @return {string}
 */
const getAuthorsUrl = () => {
  return '/authors';
};

export { getAuthorUrl, getAuthorsUrl };