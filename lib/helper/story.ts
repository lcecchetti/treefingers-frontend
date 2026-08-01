export interface StoryRef {
  id: string;
  parent?: unknown;
}

const FOREST_PARAM = 'forest';

const getStoryUrl = (story: StoryRef): string => {
  return `/story/${story.id}`;
};

const getStoriesUrl = (): string => {
  return '/stories';
};

const getStoryNewUrl = (forest?: { id: string }): string => {
  let url = '/story/new';

  if (forest) {
    url += `?${FOREST_PARAM}=${forest.id}`;
  }

  return url;
};

const isStoryRoot = (story: StoryRef): boolean => {
  return !story.parent;
};

export { getStoryUrl, getStoriesUrl, getStoryNewUrl, isStoryRoot, FOREST_PARAM };
