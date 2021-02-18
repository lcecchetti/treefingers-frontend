/**
 * Get story url
 * @param {Story} story
 * @return {string}
 */
const getStoryUrl = (story) => {

  let url = '/story/';

  // full story url passed in (ex: search)
  if (story.url) {
    return url + story.url;
  }

  if (story.root) {
    url += `${story.root.id}/`;
  }

  url += story.id;

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