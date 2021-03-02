'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    afterCreate: async (data) => {
      await strapi.services.story.updateLikesCount(data.story);
    },
    afterDelete: async (params, data) => {
      await strapi.services.story.updateLikesCount(params.story);
    },
  },
};
