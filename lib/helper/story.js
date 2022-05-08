const FOREST_PARAM = 'forest';

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
 * Get story new url
 * @param {Forest} forest
 * @return {string}
 */
 const getStoryNewUrl = (forest) => {
  let url = '/story/new';

  if (forest) {
    url += `?${FOREST_PARAM}=${forest._id}`;
  }

  return url;
};


/**
 * Check if story is root
 * @param {Story} story
 * @return {boolean}
 */
const isStoryRoot = (story) => {
  return !story.root;
}

export { getStoryUrl, getStoriesUrl, getStoryNewUrl, isStoryRoot, FOREST_PARAM };