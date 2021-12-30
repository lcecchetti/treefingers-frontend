
import { getAuthorUrl, getStoryUrl, getTagUrl } from "lib/helper";

/**
 * Get search url
 * @return {string}
 */
const getSearchUrl = (q = '') => {
  if (q) {
    q = `?q=${q}`;
  }
  return `/search${q}`;
};

/**
 * Get search result url
 * @param {Result} result
 * @return {string}
 */
const getSearchResultUrl = (result) => {
  switch (result.type) {
    case 'story':
      return getStoryUrl({ _id: result.url });
    case 'tag':
      return getTagUrl({ slug: result.url });    
    case 'author': 
      return getAuthorUrl({ username: result.url });  
  }

  return '#';
} 

export { getSearchUrl, getSearchResultUrl };