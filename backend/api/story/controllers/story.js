'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    // set author
    ctx.request.body.author = ctx.state.user.id;

    const entity = await strapi.services.story.create(ctx.request.body);
    return sanitizeEntity(entity, { model: strapi.models.story });
  },

  /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {
    // validate story author
    const story = await strapi.services.story.findOne({ id: ctx.params.id });
    if (story && story.author != ctx.state.user.id) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    // update entity
    const entity = await strapi.services.story.update(ctx.params, ctx.request.body);

    return sanitizeEntity(entity, { model: strapi.models.story });
  },
};
