'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      data.excerpt = strapi.services.story.createExcerpt(data.content);
      data.slug = strapi.services.story.createSlug(data.title);
    },
    beforeUpdate: async (params, data) => {
      data.excerpt = strapi.services.story.createExcerpt(data.content);
      data.slug = strapi.services.story.createSlug(data.title);
    },
  },
};
