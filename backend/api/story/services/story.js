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

  /**
   * Add likes informations to the given story
   * @param {Story} story
   * @param {User} user
   */
  withLikeData: async (story, user) => {
    let currentUserLike = undefined;
    if (user) {
      currentUserLike = await strapi.services.like.findOne({ story: story.id, user: user.id });
    }

    story.currentUserLike = currentUserLike;

    return story;
  },

  /**
   * Recalculate the amount of likes
   * @param {Story} story
   * @param {User} user
   */
  updateLikesCount: async (story) => {
    const likesCount = await strapi.services.like.count({ story: story.id });

    await strapi.services.story.update({ id: story.id }, { likesCount });

    story.likesCount = likesCount;
  }
};
