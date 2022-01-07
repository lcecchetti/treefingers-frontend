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
 * Get new story url
 * @return {string}
 */
const getStoryNewUrl = () => {
  return '/story/new';
};

/**
 * Check if story is root
 * @param {Story} story
 * @return {boolean}
 */
const isStoryRoot = (story) => {
  return !story.root;
}

/**
 * Get story type
 * @param {Story} story
 * @return {string}
 */
const getStoryType = (story) => {
  return isStoryRoot(story) ? 'STORY' : 'CHAPTER';
}

export { getStoryUrl, getStoriesUrl, getStoryNewUrl, isStoryRoot, getStoryType };