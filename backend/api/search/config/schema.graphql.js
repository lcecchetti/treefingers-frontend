module.exports = {
  definition: `
    type SearchResult {
      id: ID!
      url: String!
      label: String!
      excerpt: String
      type: String!
    }
  `,
  query: `
    search(q: String!): [SearchResult]
  `,
  resolver: {
    Query: {
      search: {
        description: 'Search through the db',
        resolver: 'application::search.search.search',
      },
    },
  }
}
