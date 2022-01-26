/**
 * Get forest url
 * @param {Tag} tag
 * @return {string}
 */
const getForestUrl = (forest) => {
  return `/forest/${forest.slug}`;
};

/**
 * Get forest surl
 * @return {string}
 */
 const getForestsUrl = () => {
  return `/forests`;
};

/**
 * Get new forest url
 * @return {string}
 */
 const getForestNewUrl = () => {
  return '/forest/new';
};

export { getForestsUrl, getForestUrl, getForestNewUrl };