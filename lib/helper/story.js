const FOREST_PARAM = 'forestId';

const getStoryUrl = (story) => {
  return `/story/${story.id}`;
};

const getStoriesUrl = () => {
  return '/stories';
};

const getStoryNewUrl = (forest) => {
  let url = '/story/new';

  if (forest) {
    url += `?${FOREST_PARAM}=${forest.id}`;
  }

  return url;
};

const isStoryRoot = (story) => {
  return !story.parent;
}

export { getStoryUrl, getStoriesUrl, getStoryNewUrl, isStoryRoot, FOREST_PARAM };