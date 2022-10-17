import { View, Text } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Avatar } from "@rneui/themed";

type Props = {
  title?: string;
  source?: string;
};

const UserAvatar = ({ title, source }: Props) => {
  const tw = useTailwind();

  // console.log(source);

  return (
    <Avatar
      title={title}
      size="medium"
      source={{uri: source}}
      rounded
      avatarStyle={tw("")}
      overlayContainerStyle={tw("bg-blue-400")}
      titleStyle={tw("text-white")}
      containerStyle={tw("mr-4 mb-1")}
    />
  );
};

export default UserAvatar;
