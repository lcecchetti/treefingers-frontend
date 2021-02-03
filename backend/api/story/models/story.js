'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

const slugify = require('slugify');

module.exports = {
  lifecycles: {
    beforeCreate: async (data) => {
      //@todo check for existing same slug and append an incremental number in the end in case
      if (data.title) {
        data.slug = slugify(data.title, { lower: true });
      }
    },
    beforeUpdate: async (params, data) => {
      //@todo remove when ready to make slug permanent even on title update
      if (data.title) {
        data.slug = slugify(data.title, { lower: true });
      }
    },
  },
};
