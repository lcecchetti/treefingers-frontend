'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
  /**
   * Check if a story is root or chapter
   * @todo this is necessary due to a bug in strapi where nested filters combined with parent_null returns no result
   * @param {Story} story
   * @return {boolean}
   */
  isRoot: (story) => {
    return !story.parent;
  },
};
