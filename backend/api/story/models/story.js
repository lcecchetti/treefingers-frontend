'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      data.excerpt = strapi.services.helper.createExcerpt(data.content);
      data.isRoot = strapi.services.story.isRoot(data);
    },
    beforeUpdate: async (params, data) => {
      if (data.content) {
        data.excerpt = strapi.services.helper.createExcerpt(data.content);
      }
    },
  },
};
