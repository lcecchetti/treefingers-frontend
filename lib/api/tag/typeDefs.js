import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    tag(id: ID!): Tag
  }  

  type Tag {
    id: ID!
  }
`;

export default typeDefs;