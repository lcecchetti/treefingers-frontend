import { gql } from 'apollo-server-micro';

export default gql`
  interface Connection {
    edges: [Edge!]!
    pageInfo: PageInfo!
  }

  interface Edge {
    cursor: String
    node: Node!
  }

  interface Node {
    id: ID!
  }

  type PageInfo {
    hasNextPage: Boolean!
    startCursor: String
    endCursor: String
    edgesCount: Int!
    pagesCount: Int!
    pageSize: Int!
    currentPage: Int
  }

  input PaginationInput {
    cursor: String
    skip: Int
    limit: Int
  }
`;