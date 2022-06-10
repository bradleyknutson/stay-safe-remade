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
    _id: ID!
    location: String
    timeEstimate: Int
    started: Date
    ended: Date
    eventDuration: Int
  }

  type Query {
    me: User
    users: [User]
    usersByUsername(username: ID!): [User]
    userEvents: [Event]
    userFriends: [User]
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addFriend(friendId: ID!): User
    removeFriend(friendId: ID!): User
    createEvent(location: String!, timeEstimate: Int!): Event
    endEvent(eventId: ID): Event
  }
`;
