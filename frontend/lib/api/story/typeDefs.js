import { gql } from 'apollo-server-micro';

const typeDefs = gql`
  extend type Query {
    story(id: ID!): Story
  }  

  type Story {
    id: ID!
    title: String!
    author: User!
  }
`;

export default typeDefs;