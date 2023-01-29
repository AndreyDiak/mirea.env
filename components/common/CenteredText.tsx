import React from "react";
import { Text, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { returnHexCode } from "../../utils/returnHexCodes";

interface Props {
  text: string;
  Icon: JSX.Element;
}

export const CenteredText: React.FC<Props> = ({ text, Icon }) => {
  const tw = useTailwind();

  return (
    <View style={tw("h-full w-full flex justify-center items-center")}>
      <View>
        <Text style={tw("text-center mt-4 mb-2 text-xl")}>{text}</Text>
        {Icon}
      </View>
    </View>
  );
};
