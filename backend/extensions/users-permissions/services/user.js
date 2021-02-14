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
  * Get author url
  * @param {Chapter} chapter
  * @return {string}
  */
  getAuthorUrl: (user) => {
    return `/author/${user.username}`;
  }
};
