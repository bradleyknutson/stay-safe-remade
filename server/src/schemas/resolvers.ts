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
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

        return userData;
      }

      throw new AuthenticationError("Not logged in");
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
  },
};
