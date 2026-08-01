export interface ForestRef {
  name: string;
}

const getForestUrl = (forest: ForestRef): string => {
  return `/forest/${forest.name}`;
};

const getForestsUrl = (): string => {
  return `/forests`;
};

const getForestNewUrl = (): string => {
  return '/forest/new';
};

export { getForestsUrl, getForestUrl, getForestNewUrl };
