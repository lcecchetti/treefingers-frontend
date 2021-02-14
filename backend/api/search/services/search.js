'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  //@todo improve, standardize and sanitize
  async search(q) {

    const chapters = await strapi.services.chapter.search({ _q: q });
    const chaptersResults = chapters.map((chapter) => ({
      id: chapter.id,
      type: 'chapter',
      slug: chapter.id,
      title: chapter.title,
      content: chapter.content,
    }));

    const stories = await strapi.services.story.search({ _q: q });
    const storiesResults = stories.map((story) => ({
      id: story.id,
      type: 'story',
      slug: story.slug,
      title: story.title,
      content: story.content,
    }));

    const tags = await strapi.services.tag.search({ _q: q });
    const tagsResults = tags.map((tag) => ({
      id: tag.id,
      type: 'tag',
      slug: tag.slug,
      title: tag.label,
      content: '',
    }));

    const users = await strapi.query('user', 'users-permissions').search({ _q: q });
    const usersResults = users.map((user) => ({
      id: user.id,
      type: 'user',
      slug: user.username,
      title: user.username,
      content: user.bio,
    }));

    const searchResults = [
      ...usersResults,
      ...storiesResults,
      ...tagsResults,
      ...chaptersResults,
    ];

    return searchResults;
  },
};
