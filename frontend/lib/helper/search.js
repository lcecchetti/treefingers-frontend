import { getAuthorUrl } from "./author";
import { getStoryUrl } from "./story";
import { getTagUrl } from "./tag";

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
 * @return {string}
 */
const getSearchResultUrl = (result, type) => {
  switch (type) {
    case 'story':
      return getStoryUrl(result);
    case 'tag':
      return getTagUrl(result);    
    case 'user': 
      return getAuthorUrl(result);  
  }

  return '#';
} 

export { getSearchUrl, getSearchResultUrl };