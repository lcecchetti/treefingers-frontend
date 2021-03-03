'use strict';

const { sanitizeEntity } = require('strapi-utils');

module.exports = {

  /**
   * Retrieve authenticated user.
   * Do not return error, but empty user if not found.
   * @return {Object|Array}
   */
  async self(ctx) {
    const user = ctx.state.user;

    ctx.body = sanitizeEntity(user, {
      model: strapi.query('user', 'users-permissions').model,
    });
  },

    /**
   * Update a record.
   *
   * @return {Object}
   */

  async update(ctx) {

    // validate story author
    const user = await strapi.plugins['users-permissions'].services.user.fetch({ id: ctx.params.id });

    if (user && user.id != ctx.state.user.id) {
      return ctx.unauthorized(`You can't update this entry`);
    }

    // update entity
    const entity = await strapi.plugins['users-permissions'].services.user.edit(ctx.params, ctx.request.body);

    return sanitizeEntity(entity, { model: strapi.query('user', 'users-permissions').model, });
  },

  /**
   * Find records
   * @param {Object} ctx
   * @return {Array<User>}
   */
  find: async (ctx) => {
    let users;

    users = await strapi.plugins['users-permissions'].services.user.fetchAll(ctx.query);

    users = await Promise.all(
      users.map(async (user) => {
        return await strapi.plugins['users-permissions'].services.user.withLikeData(user, ctx.state.user);
      })
    );

    return users;
  },

  /**
   * Find one record
   * @param {Object} ctx
   * @return {Story}
   */
  findOne: async (ctx) => {
    const user = await strapi.plugins['users-permissions'].services.user.fetch(ctx.params);

    if (!user) {
      return ctx.notFound();
    }

    return strapi.plugins['users-permissions'].services.user.withLikeData(user, ctx.state.user);
  },
};
