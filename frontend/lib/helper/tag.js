/**
 * Get tag url
 * @param {Tag} tag
 * @return {string}
 */
const getTagUrl = (tag) => {
  const link = '/tag/' + tag.slug;
  return link;
};


export { getTagUrl };