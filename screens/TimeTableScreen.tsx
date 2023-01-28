import { View, Text } from "react-native";
import React from "react";
import { useTailwind } from "tailwind-rn/dist";
import { Icon } from "@rneui/themed";
import { returnHexCode } from "../utils/returnHexCodes";
import { useSelector } from "react-redux";
import { getUser } from "../features/userSlice";

type Props = {};

export const TimeTableScreen = () => {
  const tw = useTailwind();
  const user = useSelector(getUser);
  return (
    <View style={tw("w-full h-full flex flex-row items-center justify-center")}>
      <View>
        <Text style={tw("text-lg")}>Находится в разработке...</Text>
        <Icon
          name="pending"
          type="material"
          color={returnHexCode(user?.theme as AppTheme)}
          size={30}
        />
      </View>
    </View>
  );
};
