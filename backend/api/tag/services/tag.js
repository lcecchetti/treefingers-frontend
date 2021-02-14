'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {

  /**
   * Get tag url
   * @param {Tag} tag
   * @return {string}
   */
  getStoryUrl: (tag) => {
    return `/tag/${tag.slug}`;
  }

};
