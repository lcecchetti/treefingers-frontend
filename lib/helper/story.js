/**
 * Get story url
 * @param {Story} story
 * @return {string}
 */
const getStoryUrl = (story) => {
  return `/story/${story._id}`;
};

/**
 * Check if story is root
 * @param {Story} story
 * @return {boolean}
 */
const isStoryRoot = (story) => {
  return !story.root;
}

export { getStoryUrl, isStoryRoot };