import { View, Text } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Avatar } from "@rneui/themed";

type Props = {
  title?: string;
  source?: string;
  size?: string;
};

const UserAvatar = ({ title, source, size }: Props) => {
  const tw = useTailwind();

  return !!source ? (
    <Avatar
      // @ts-ignore
      size={size || "medium"}
      source={{ uri: source }}
      rounded
      avatarStyle={tw("")}
      overlayContainerStyle={tw("bg-blue-400")}
      titleStyle={tw("text-white")}
      containerStyle={tw("mr-4 mb-1")}
    />
  ) : (
    <Avatar
      title={title}
      // @ts-ignore
      size={size || "medium"}
      rounded
      avatarStyle={tw("")}
      overlayContainerStyle={tw("bg-blue-400")}
      titleStyle={tw("text-white")}
      containerStyle={tw("mr-4 mb-1")}
    />
  );
};

export default UserAvatar;
