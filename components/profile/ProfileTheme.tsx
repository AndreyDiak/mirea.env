import React from "react";

import { View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { ThemeCard } from "../ThemeCard";

export const ProfileTheme: React.FC = React.memo(() => {
   const tw = useTailwind();
   return (
      <View style={tw("mb-4")}>
         <View style={tw("flex flex-row justify-center -mr-4")}>
            <ThemeCard isBordered theme="blue" />
            <ThemeCard isBordered theme="emerald" />
            <ThemeCard isBordered theme="rose" />
            <ThemeCard isBordered theme="violet" />
         </View>
      </View>
   );
});
