/**
 * Get story url
 * @param {Story} story
 * @return {string}
 */
const getStoryUrl = (story) => {
  return `/story/${story._id}`;
};

/**
 * Get stories url
 * @return {string}
 */
 const getStoriesUrl = () => {
  return '/stories';
};

/**
 * Check if story is root
 * @param {Story} story
 * @return {boolean}
 */
const isStoryRoot = (story) => {
  return !story.root;
}

export { getStoryUrl, getStoriesUrl, isStoryRoot };