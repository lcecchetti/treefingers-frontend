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
  create: async (ctx) => {

    // set user
    ctx.request.body.user = ctx.state.user.id;

    // block like creation with multiple entities
    if (ctx.request.body.length > 2) {
      return ctx.badRequest('Too many parameters provided');
    }

    // prepare where clause to search for existing like
    const where = {
      user: ctx.state.user.id
    };

    ctx.request.body.story && (where.story = ctx.request.body.story);
    ctx.request.body.author && (where.author = ctx.request.body.author);
    ctx.request.body.comment && (where.comment = ctx.request.body.comment);

    const like = await strapi.services.like.findOne(where);

    if (like) {
      return ctx.badRequest('Like already exist');
    }

    // create like
    const entity = await strapi.services.like.create(ctx.request.body);
    return sanitizeEntity(entity, { model: strapi.models.like });
  },

  /**
 * Delete a record.
 * @return {Object}
 */
  delete: async (ctx) => {
    const like = await strapi.services.like.findOne(ctx.params);

    if (!like || like.user.id != ctx.state.user.id) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    const entity = await strapi.services.like.delete(ctx.params);

    return sanitizeEntity(entity, { model: strapi.models.like });
  },
};
