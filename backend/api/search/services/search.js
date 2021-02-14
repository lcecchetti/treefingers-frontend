'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  //@todo improve, standardize and sanitize
  async search(q) {

    const stories = await strapi.services.story.search({ _q: q });
    const storiesResults = stories.map((story) => ({
      id: story.id,
      url: strapi.services.story.getStoryUrl(story),
      label: story.title,
      excerpt: story.excerpt,
    }));

    const tags = await strapi.services.tag.search({ _q: q });
    const tagsResults = tags.map((tag) => ({
      id: tag.id,
      url: strapi.services.tag.getTagUrl(tag),
      label: tag.label,
      excerpt: '',
    }));

    const users = await strapi.query('user', 'users-permissions').search({ _q: q });
    const usersResults = users.map((user) => ({
      id: user.id,
      url: strapi.plugins["users-permissions"].services.user.getAuthorUrl(user),
      label: user.username,
      excerpt: user.excerpt,
    }));

    const searchResults = [
      ...usersResults,
      ...storiesResults,
      ...tagsResults,
    ];

    return searchResults;
  },
};
