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
  //@todo improve slug system to auto append incremental numebers
  //@todo move common logic to utils (slug/excerpt)
  createSlug: (text) => {
    const slugify = require('slugify');
    const slug = slugify(text, { lower: true });
    return slug;
  },
};
