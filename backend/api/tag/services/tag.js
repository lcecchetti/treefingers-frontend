'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {

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

  /**
   * Get tag url
   * @param {Tag} tag
   * @return {string}
   */
  getStoryUrl: (tag) => {
    return `/tag/${tag.slug}`;
  }

};
