/**
 * Get story excerpt
 * @param {Story} story
 * @param {int} length
 * @return {string}
 */
const getExcerpt = (story, length = 255, suffix = '...') => {
  const excerpt = story.content.substring(0, length).trim() + suffix;
  return excerpt;
};

/**
 * Get story url
 * @param {Story} story
 * @return {string}
 */
const getStoryUrl = (story) => {
  const link = '/story/' + story.slug;
  return link;
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

export { getExcerpt, getStoryUrl, getStoriesUrl, getStoryNewUrl };