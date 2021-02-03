/**
 * Excerpt length
 * @type {string}
 */
const EXCERPT_LENGTH = 255;

/**
 * Get story excerpt
 * @param {Story} story
 * @param {int} length
 * @return {string}
 */
const getExcerpt = (story, length) => {
  const excerpt = story.content.substring(0, length || EXCERPT_LENGTH) + '...';
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