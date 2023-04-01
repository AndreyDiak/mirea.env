import React from "react";

import { Text, View } from "react-native";

import { Icon } from "@rneui/base";
import { useTailwind } from "tailwind-rn/dist";

import { COLORS_400 } from "../../../typings";

export const AppLoader: React.FC = React.memo(() => {
   const tw = useTailwind();

   return (
      <View style={tw("h-full w-full flex flex-col items-center justify-center")}>
         <Text style={tw("text-lg")}>Загрузка приложения...</Text>
         <Icon name="pending" type="material" color={COLORS_400.BLUE} size={30} />
      </View>
   );
});
