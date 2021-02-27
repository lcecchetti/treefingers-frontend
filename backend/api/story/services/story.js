'use strict';

const story = require("../controllers/story");

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

  /**
   * Add likes informations to the given story
   * @param {Story} story
   * @param {User} user
   */
  withLikeData: async (story, user) => {
    story.likesCount = await strapi.api.like.services.like.count({ story: story.id });

    let userLike = undefined;
    if (user) {
      userLike = await strapi.api.like.services.like.findOne({ story: story.id, user: user.id });
    }

    story.userLike = userLike;

    return story;
  },
};
