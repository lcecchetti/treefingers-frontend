import { gql } from 'apollo-server-micro';

export default gql`
  extend type Query {
    like(id: ID!): Like
  }  

  type Like {
    id: ID!
    user: User!
    story: Story
    comment: Comment
    author: User
    createdAt: Date!
  }
`;