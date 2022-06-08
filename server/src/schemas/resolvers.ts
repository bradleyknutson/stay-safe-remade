import { AuthenticationError } from "apollo-server-express";
import { DateTimeResolver } from "graphql-scalars";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { signToken } from "../utils/auth.js";
interface credentials {
  username: string;
  password: string;
  email?: string;
}

export const resolvers = {
  Date: DateTimeResolver,
  Query: {
    me: async (_parent: any, args: any, context: any) => {
      if (context.user) {
        const { _id: userId } = context.user.data;
        const userData = await User.findOne({ _id: userId })
          .select("-__v -password")
          .populate("friends")
          .populate("events");
        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    users: async (_parent: any, args: any, context: any) => {
      const users = await User.find()
        .select("-__v -password")
        .populate("friends")
        .populate("events");
      return users;
    },
    usersByUsername: async (_parent: any, { username }: any, context: any) => {
      const users = await User.find({
        username: { $regex: ".*" + username + ".*", $options: "i" },
      }).select("username _id");
      return users;
    },
  },
  Mutation: {
    addUser: async (_parent: any, args: credentials) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (_parent: any, { username, password }: credentials) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new AuthenticationError("Incorrect Credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect Credentials");
      }

      const token = signToken(user);
      return { token, user };
    },
    addFriend: async (_parent: any, { friendId }: any, context: any) => {
      if (context.user) {
        const { _id: userId } = context.user.data;
        if (userId === friendId) {
          throw new AuthenticationError("Unable to add yourself as a friend");
        }
        const updatedUser = await User.findByIdAndUpdate(
          { _id: userId },
          { $addToSet: { friends: friendId } },
          { new: true }
        )
          .select("-__v -password")
          .populate("friends");
        return updatedUser;
      }
      throw new AuthenticationError("Not logged in");
    },
    removeFriend: async (_parent: any, { friendId }: any, context: any) => {
      if (context.user) {
        const { _id: userId } = context.user.data;
        const updatedUser = await User.findByIdAndUpdate(
          { _id: userId },
          { $pull: { friends: friendId } },
          { new: true }
        )
          .select("-__v -password")
          .populate("friends");
        return updatedUser;
      }
      throw new AuthenticationError("Not logged in");
    },
    createEvent: async (_parent: any, args: any, context: any) => {
      if (context.user) {
        const newEvent = await Event.create(args);
        await User.findByIdAndUpdate(
          { _id: context.user.data._id },
          { $push: { events: newEvent._id } }
        );
        return newEvent;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
};
