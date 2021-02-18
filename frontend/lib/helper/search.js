
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
      return getStoryUrl(result);
    case 'tag':
      return getTagUrl(result);    
    case 'author': 
      return getAuthorUrl(result);  
  }

  return '#';
} 

export { getSearchUrl, getSearchResultUrl };