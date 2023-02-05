import React from "react";

import { Text, View } from "react-native";

import { Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUser } from "../features/userSlice";
import { returnHexCode } from "../utils/returnHexCodes";

export function TimeTableScreen() {
   const tw = useTailwind();
   const user = useSelector(selectUser);
   return (
      <View style={tw("w-full h-full flex flex-row items-center justify-center")}>
         <View>
            <Text style={tw("text-lg")}>Находится в разработке...</Text>
            <Icon name="pending" type="material" color={returnHexCode(user.theme)} size={30} />
         </View>
      </View>
   );
}
