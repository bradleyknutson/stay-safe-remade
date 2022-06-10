import React from "react";
import { useQuery } from "@apollo/client";
import { GET_FRIENDS } from "../../utils/queries";
import { List, ListItem, ListItemText } from "@mui/material";

export const FriendsList = () => {
  const { loading, error: getFriendsErr, data } = useQuery(GET_FRIENDS);

  if (loading) return <p>Loading...</p>;
  if (getFriendsErr) return <p>{`Error! ${getFriendsErr.message}`}</p>;
  return (
    <List>
      {data.userFriends.map((friend: any) => (
        <ListItem key={friend.username}>
          <ListItemText inset primary={friend.username} />
        </ListItem>
      ))}
    </List>
  );
};
