/**
 * Get tag url
 * @param {Tag} tag
 * @return {string}
 */
const getTagUrl = (tag) => {

  let url = '/tag/';

  if (tag.url) {
    return url + tag.url;
  }

  return url + tag.slug;
};

export { getTagUrl };