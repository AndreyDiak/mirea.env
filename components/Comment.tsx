import { View, Text } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Icon } from "@rneui/themed";

type Props = {
  comment: Comment;
  index: number;
  isLast: boolean;
};

const Comment = ({ comment, index, isLast }: Props) => {
  const tw = useTailwind();

  return (
    <View style={tw("w-full")}>
      <View style={tw("w-full bg-gray-50 p-4 rounded-sm")}>
        <Text style={tw("mb-2")}>{comment.text}</Text>
        <Text style={tw("text-right text-xs")}>{comment.email}</Text>
      </View>
      {!isLast && (
        <View style={tw(`flex flex-row px-8 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`)}>
          <View style={tw("bg-gray-300 w-0.5 rounded-md h-4 my-1")} />
        </View>
      )}
    </View>
  );
};

export default Comment;
