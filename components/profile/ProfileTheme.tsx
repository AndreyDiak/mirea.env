import React from "react";

import { View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { USER_THEME } from "../../typings";
import { ThemeCard } from "../common/ThemeCard";

export const ProfileTheme: React.FC = React.memo(() => {
   const tw = useTailwind();
   return (
      <View style={tw("mb-4")}>
         <View style={tw("flex flex-row justify-center -mr-4")}>
            <ThemeCard isBordered theme={USER_THEME.BLUE} />
            <ThemeCard isBordered theme={USER_THEME.EMERALD} />
            <ThemeCard isBordered theme={USER_THEME.ROSE} />
            <ThemeCard isBordered theme={USER_THEME.VIOLET} />
         </View>
      </View>
   );
});
