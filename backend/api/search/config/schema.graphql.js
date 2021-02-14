module.exports = {
  definition: `
    type SearchResult {
      id: ID!
      type: String!
      slug: String!
      title: String!
      content: String
    }
  `,
  query: `
    search(q: String!): [SearchResult]
  `,
  resolver: {
    Query: {
      search: {
        description: 'Search through the db',
        resolverOf: 'application::story.story.find',
        resolver: 'application::search.search.search',
      },
    },
  }
}
