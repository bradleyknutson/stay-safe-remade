import { AuthenticationError } from "apollo-server-express";
import User from "../models/User.js";
import { signToken } from "../utils/auth";

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
};
