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

    // make action required for chapters
    if (ctx.request.body.parent && !ctx.request.body.action) {
      return ctx.badRequest('Action is required for chapters');
    }

    // set author
    ctx.request.body.author = ctx.state.user.id;

    // create story
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

    // restrict update to the author
    if (story && story.author != ctx.state.user.id) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    // make action required for chapters
    if (!story.isRoot && !ctx.request.body.action) {
      return ctx.badRequest('Action is required for chapters');
    }

    // update entity
    const entity = await strapi.services.story.update(ctx.params, ctx.request.body);

    return sanitizeEntity(entity, { model: strapi.models.story });
  },

  /**
   * Find records
   * @param {Object} ctx
   * @return {Array<Story>}
   */
  find: async (ctx) => {
    let stories;

    stories = await strapi.services.story.find(ctx.query);

    stories = await Promise.all(
      stories.map(async (story) => {
        return await strapi.services.story.withLikeData(story, ctx.state.user);
      })
    );

    return stories.map(story => sanitizeEntity(story, { model: strapi.models.story }));;
  },

  /**
   * Find one record
   * @param {Object} ctx
   * @return {Story}
   */
  findOne: async (ctx) => {
    const story = await strapi.services.story.findOne(ctx.params);

    if (!story) {
      return ctx.notFound();
    }

    await strapi.services.story.withLikeData(story, ctx.state.user);

    return sanitizeEntity(story, { model: strapi.models.story });
  },
};
