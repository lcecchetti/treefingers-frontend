import { gql } from 'apollo-server-micro';

export default gql`
  extend type Query {
    story(id: ID!): Story
  }  

  type Story {
    id: ID!
    title: String!
    author: User!
  }
`;