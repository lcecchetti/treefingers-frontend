/**
 * Get tag url
 * @param {Tag} tag
 * @return {string}
 */
const getTagUrl = (tag) => {
  return `/tag/${tag.slug}`;
};

export { getTagUrl };