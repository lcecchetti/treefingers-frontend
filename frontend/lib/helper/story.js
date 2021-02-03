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

export { getExcerpt, getStoryUrl };