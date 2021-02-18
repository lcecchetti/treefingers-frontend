'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
module.exports = {

  //@todo improve?
  async search(q) {

    const stories = await strapi.services.story.search({ _q: q });
    const storiesResults = stories.map((story) => ({
      id: story.id,
      url: story.root ? `${story.root}/${story.id}` : story.id,
      label: story.title,
      excerpt: story.excerpt,
      type: 'story',
    }));

    const tags = await strapi.services.tag.search({ _q: q });
    const tagsResults = tags.map((tag) => ({
      id: tag.id,
      url: tag.slug,
      label: tag.label,
      excerpt: '',
      type: 'tag',
    }));

    const users = await strapi.query('user', 'users-permissions').search({ _q: q });
    const usersResults = users.map((user) => ({
      id: user.id,
      url: user.username,
      label: user.username,
      excerpt: user.excerpt,
      type: 'author'
    }));

    const searchResults = [
      ...usersResults,
      ...storiesResults,
      ...tagsResults,
    ];

    return searchResults;
  },
};
