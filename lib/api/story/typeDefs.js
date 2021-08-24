import { gql } from 'apollo-server-micro';

export default gql`
  extend type Query {
    story(id: ID!): Story
  }  

  type Story {
    id: ID!
    title: String!
    content: String!
    action: String
    excerpt: String!
    author: User!
    root: Story
    parent: Story
    likesCount: Int!
    commentsCount: Int!
    tags: [Tag]
    createdAt: Date!
    updatedAt: Date!
  }
`;