import Context from "@mui/base/TabsUnstyled/TabsContext";
import { AuthenticationError } from "apollo-server-express";
import User from "../models/User.js";
import { signToken } from "../utils/auth.js";

interface credentials {
  username: string;
  password: string;
  email?: string;
}

export const resolvers = {
  Query: {
    me: async (_parent: any, args: any, context: any) => {
      if (context.user) {
        const { _id: userId } = context.user.data;
        const userData = await User.findOne({ _id: userId })
          .select("-__v -password")
          .populate("friends");
        return userData;
      }

      throw new AuthenticationError("Not logged in");
    },
    users: async (_parent: any, args: any, context: any) => {
      const users = User.find().select("-__v -password").populate("friends");
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
  },
};
