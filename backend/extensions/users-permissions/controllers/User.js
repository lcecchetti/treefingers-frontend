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
};
