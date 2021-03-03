'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
    /**
   * Add likes informations to the given author
   * @param {User} author
   * @param {User} user
   */
  withLikeData: async (author, user) => {
    let currentUserLike = undefined;
    if (user) {
      currentUserLike = await strapi.services.like.findOne({ author: author.id, user: user.id });
    }

    author.currentUserLike = currentUserLike;

    return author;
  },

  /**
   * Recalculate the amount of likes
   * @param {User} author
   * @param {User} user
   */
  updateLikesCount: async (author) => {
    const likesCount = await strapi.services.like.count({ author: author.id });

    await strapi.plugins['users-permissions'].services.user.edit({ id: author.id }, { likesCount });

    author.likesCount = likesCount;
  }
};
