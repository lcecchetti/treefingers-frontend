'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {

  /**
  * Create excerpt
  * @param {string} text
  * @param {int} length
  * @param {string} suffix
  * @return {string}
  */
  createExcerpt: (text, length = 255, suffix = '...') => {
    if (!text) {
      return '';
    }

    const excerpt = text.substring(0, length - suffix.length).trim() + suffix;
    return excerpt;
  },

  /**
    * Create slug
    * @param {string} text
    * @return {string}
    */
  createSlug: (text) => {
    const slugify = require('slugify');
    const slug = slugify(text, { lower: true });
    return slug;
  },

  /**
   * Get story url
   * @param {Story} story
   * @return {string}
   */
  getStoryUrl: (story) => {

    let url = '/story';

    if (story.root) {
      url += `/${story.root.slug}`;
    }

    url += `/${story.slug}`;

    return url;
  }
};
