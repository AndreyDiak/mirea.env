import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";

type Props = {
  title: string;
  callback: () => void;
};

export const Button = ({ title, callback }: Props) => {
  const tw = useTailwind();

  return (
    <TouchableOpacity
      style={tw("flex flex-row justify-center")}
      onPress={callback}
    >
      <Text
        style={tw(
          "bg-blue-400 px-3 py-2 text-white rounded-md font-semibold text-lg"
        )}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};
