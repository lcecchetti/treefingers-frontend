'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  async findBySlug(ctx) {
    const { _slug } = ctx.params;
    console.log(_slug);

    const entity = await strapi.services.story.findOne({ slug: _slug });
    return sanitizeEntity(entity, { model: strapi.models.story });
  },
};
