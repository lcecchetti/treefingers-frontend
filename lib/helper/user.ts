export interface UserRef {
  username: string;
}

const getUserUrl = (user: UserRef): string => {
  return `/user/${user.username}`;
};

const getAuthorsUrl = (): string => {
  return `/authors`;
};

export { getUserUrl, getAuthorsUrl };
