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
        await strapi.plugins['users-permissions'].services.user.updateLikesCount(data.author);
      }
      else if (data.comment) {
        await strapi.services.comment.updateLikesCount(data.comment);
      }

    },
    afterDelete: async (params, data) => {
      if (params.story) {
        await strapi.services.story.updateLikesCount(params.story);
      }
      else if (params.author) {
        await strapi.plugins['users-permissions'].services.user.updateLikesCount(params.author);
      }
      else if (params.comment) {
        await strapi.services.comment.updateLikesCount(params.comment);
      }
    },
  },
};
