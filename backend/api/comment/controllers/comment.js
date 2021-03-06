'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {

  async update(ctx) {

    // validate comment author
    const comment = await strapi.services.comment.findOne({ id: ctx.params.id });

    if (comment && comment.user != ctx.state.user.id) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    // update entity
    const entity = await strapi.services.comment.update(ctx.params, ctx.request.body);

    return sanitizeEntity(entity, { model: strapi.models.comment });
  },

  /**
   * Delete a record.
   * @return {Object}
   */
  async delete(ctx) {
    const comment = await strapi.services.comment.findOne(ctx.params);

    if (!comment || comment.user.id != ctx.state.user.id) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    const entity = await strapi.services.comment.delete(ctx.params);

    return sanitizeEntity(entity, { model: strapi.models.comment });
  },

   /**
   * Find records
   * @param {Object} ctx
   * @return {Array<Comment>}
   */
  find: async (ctx) => {
    let comments;

    comments = await strapi.services.comment.find(ctx.query);

    comments = await Promise.all(
      comments.map(async (comment) => {
        return await strapi.services.comment.withLikeData(comment, ctx.state.user);
      })
    );

    return comments.map(comment => sanitizeEntity(comment, { model: strapi.models.comment }));;
  },

  /**
   * Find one record
   * @param {Object} ctx
   * @return {Comment}
   */
  findOne: async (ctx) => {
    const comment = await strapi.services.comment.findOne(ctx.params);

    if (!comment) {
      return ctx.notFound();
    }

    // add like data
    strapi.services.comment.withLikeData(comment, ctx.state.user);

    return sanitizeEntity(comment, { model: strapi.models.comment });
  },
};
