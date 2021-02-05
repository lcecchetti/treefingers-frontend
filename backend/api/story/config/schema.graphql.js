module.exports = {
  query: `
    storyBySlug(slug: String!): Story!
  `,
  resolver: {
    Query: {
      storyBySlug: {
        description: 'Return the story by slug',
        resolverOf: 'application::story.story.findOne',
        resolver: 'application::story.story.findBySlug',
      },
    },
  },
};
