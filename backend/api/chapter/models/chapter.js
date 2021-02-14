'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      data.excerpt = strapi.services.chapter.createExcerpt(data.content);
    },
    beforeUpdate: async (params, data) => {
      data.excerpt = strapi.services.chapter.createExcerpt(data.content);
    },
  },
};
