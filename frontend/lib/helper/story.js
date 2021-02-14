/**
 * Get story url
 * @param {Story} story
 * @return {string}
 */
const getStoryUrl = (story) => {
  const url = '/story/' + story.slug;
  return url;
};

/**
 * Get stories url
 * @return {string}
 */
const getStoriesUrl = () => {
  return '/stories';
};

/**
 * Get new story url
 * @return {string}
 */
const getStoryNewUrl = () => {
  return '/story/new';
};

export { getStoryUrl, getStoriesUrl, getStoryNewUrl };