/**
 * Get user url
 * @param {User} user
 * @return {string}
 */
const getUserUrl = (user) => {
  return `/user/${user.username}`;
};

/**
 * Get authors url
 * @return {string}
 */
 const getAuthorsUrl = () => {
  return `/authors`;
};

export { getUserUrl, getAuthorsUrl };