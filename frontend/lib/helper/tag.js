/**
 * Get tag url
 * @param {Tag} tag
 * @return {string}
 */
const getTagUrl = (tag) => {
  const url = `/tag/${tag.slug}`;
  return url;
};


export { getTagUrl };