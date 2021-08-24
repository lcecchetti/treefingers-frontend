import { gql } from 'apollo-server-micro';

export default gql`
  extend type Query {
    tag(id: ID!): Tag
  }  

  type Tag {
    id: ID!
    story: Story!
    label: String!
    slug: String!
    createdAt: Date!
  }
`;