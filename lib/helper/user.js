const getUserUrl = (user) => {
  return `/user/${user.username}`;
};

const getAuthorsUrl = () => {
  return `/authors`;
};

export { getUserUrl, getAuthorsUrl };