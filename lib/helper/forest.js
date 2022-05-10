const getForestUrl = (forest) => {
  return `/forest/${forest.name}`;
};

const getForestsUrl = () => {
  return `/forests`;
};

const getForestNewUrl = () => {
  return '/forest/new';
};

export { getForestsUrl, getForestUrl, getForestNewUrl };