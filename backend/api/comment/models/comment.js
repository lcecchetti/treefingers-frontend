'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    afterCreate: async (data) => {
      if (data.story) {
        await strapi.services.story.updateCommentsCount(data.story);
      }
    },
    afterDelete: async (params, data) => {
      if (params.story) {
        await strapi.services.story.updateCommentsCount(params.story);
      }
    },
  },
};
