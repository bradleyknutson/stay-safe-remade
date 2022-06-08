import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    friends: [User]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
    users: [User]
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addFriend(friendId: String!): User
    removeFriend(friendId: String!): User
  }
`;
