/**
 * Get user url
 * @param {User} user
 * @return {string}
 */
const getUserUrl = (user) => {
  return `/user/${user.username}`;
};

export { getUserUrl };