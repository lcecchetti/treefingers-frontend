'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      data.slug = strapi.services.tag.createSlug(data.label);
    },
    beforeUpdate: async (params, data) => {
      data.slug = strapi.services.tag.createSlug(data.label);
    },
  },
};
