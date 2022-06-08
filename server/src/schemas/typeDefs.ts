import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar Date

  type User {
    _id: ID!
    username: String!
    email: String
    friends: [User]
    events: [Event]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Event {
    location: String
    timeEstimate: Int
    started: Date
    ended: Date
    eventDuration: Int
  }

  type Query {
    me: User
    users: [User]
    usersByUsername(username: String!): [User]
    userEvents: [Event]
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addFriend(friendId: String!): User
    removeFriend(friendId: String!): User
    createEvent(location: String!, timeEstimate: Int!): Event
  }
`;
