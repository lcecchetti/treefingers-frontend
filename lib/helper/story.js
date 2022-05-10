const FOREST_PARAM = 'forest';

const getStoryUrl = (story) => {
  return `/story/${story._id}`;
};

const getStoriesUrl = () => {
  return '/stories';
};

const getStoryNewUrl = (forest) => {
  let url = '/story/new';

  if (forest) {
    url += `?${FOREST_PARAM}=${forest._id}`;
  }

  return url;
};

const isStoryRoot = (story) => {
  return !story.root;
}

export { getStoryUrl, getStoriesUrl, getStoryNewUrl, isStoryRoot, FOREST_PARAM };