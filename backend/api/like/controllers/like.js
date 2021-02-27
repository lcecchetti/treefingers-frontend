'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a record.
   * @return {Object}
   */
  async create(ctx) {
    // set user
    ctx.request.body.user = ctx.state.user.id;

    const like = await strapi.services.like.findOne({ user: ctx.state.user.id, story: ctx.request.body.story });

    if (like) {
      return ctx.badRequest('Like already exist');
    }

    const entity = await strapi.services.like.create(ctx.request.body);
    return sanitizeEntity(entity, { model: strapi.models.like });
  },

    /**
   * Delete a record.
   * @return {Object}
   */
  async delete(ctx) {
    const like = await strapi.services.like.findOne(ctx.params);

    if (!like || like.user.id != ctx.state.user.id) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    const entity = await strapi.services.like.delete(ctx.params);

    return sanitizeEntity(entity, { model: strapi.models.like });
  },
};
