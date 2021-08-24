import { gql } from 'apollo-server-micro';

export default gql`
  extend type Query {
    comment(id: ID!): Comment
  }  

  type Comment {
    id: ID!
    user: User!
    story: Story
    likesCount: Int!
    createdAt: Date!
    updatedAt: Date!
  }
`;