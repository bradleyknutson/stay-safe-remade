import { gql } from "@apollo/client";

export const GET_FRIENDS = gql`
  query getFriends {
    userFriends {
      username
      email
    }
  }
`;
