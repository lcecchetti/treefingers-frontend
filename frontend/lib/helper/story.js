/**
 * Get story url
 * @param {Story} story
 * @return {string}
 */
const getStoryUrl = (story) => {

  let url = '/story';

  if (story.root) {
    url += `/${story.root.slug}`;
  }

  url += `/${story.slug}`;

  return url;
}

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