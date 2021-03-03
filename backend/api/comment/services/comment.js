'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {

  /**
   * Add likes informations to the given comment
   * @param {Comment} comment
   * @param {User} user
   */
  withLikeData: async (comment, user) => {
    let currentUserLike = undefined;
    if (user) {
      currentUserLike = await strapi.services.like.findOne({ comment: comment.id, user: user.id });
    }

    comment.currentUserLike = currentUserLike;

    return comment;
  },

  /**
   * Recalculate the amount of likes
   * @param {Comment} comment
   * @param {User} user
   */
  updateLikesCount: async (comment) => {
    const likesCount = await strapi.services.like.count({ comment: comment.id });

    await strapi.services.comment.update({ id: comment.id }, { likesCount });

    comment.likesCount = likesCount;
  }
};
