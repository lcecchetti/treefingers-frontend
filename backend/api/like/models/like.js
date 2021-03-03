'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    afterCreate: async (data) => {
      if (data.story) {
        await strapi.services.story.updateLikesCount(data.story);
      }
      else if (data.author) {
        strapi.plugins['users-permissions'].services.user.updateLikesCount(data.author);
      }
    },
    afterDelete: async (params, data) => {
      if (params.story) {
        await strapi.services.story.updateLikesCount(params.story);
      }
      else if (params.author) {
        await strapi.plugins['users-permissions'].services.user.updateLikesCount(params.author);
      }
    },
  },
};
