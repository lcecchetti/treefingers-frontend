import { gql } from 'apollo-server-micro';

export default gql`
  extend type Query {
    comment(id: ID!): Comment
    comments(filter: String, sort: String, pagination: PaginationInput): CommentConnection!
  }  

  extend type Mutation {
    createComment(input: CreateCommentInput!): CreateCommentPayload!
  }

  input CreateCommentDataInput {
    content: String!
    story: ID!
  }

  input CreateCommentInput {
    data: CreateCommentDataInput!
  }

  type CreateCommentPayload {
    comment: Comment!
  }

  type CommentEdge implements Edge {
    cursor: String
    node: Comment! 
  }

  type CommentConnection implements Connection {
    edges: [CommentEdge!]!
    pageInfo: PageInfo!
  }

  type Comment implements Node {
    id: ID!
    content: String!
    user: User!
    story: Story
    likesCount: Int!
    createdAt: Date!
    updatedAt: Date!
  }
`;