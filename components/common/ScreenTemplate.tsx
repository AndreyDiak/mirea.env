import React, { useLayoutEffect } from "react";

import { StyleProp, ViewStyle } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import { useTheme } from "../../hooks";

interface Props {
   children: JSX.Element;
   style?: StyleProp<ViewStyle>;
}

export const ScreenTemplate: React.FC<Props> = React.memo(({ children, style }) => {
   const navigation = useNavigation();

   const { APP_THEME_MAIN, APP_THEME_SECONDARY } = useTheme();

   useLayoutEffect(() => {
      navigation.setOptions({
         headerStyle: {
            backgroundColor: APP_THEME_SECONDARY,
         },
      });
   });

   return (
      <LinearGradient
         colors={[APP_THEME_MAIN, APP_THEME_MAIN]}
         style={[
            style,
            {
               backgroundColor: APP_THEME_MAIN,
               height: "100%",
            },
         ]}
         end={{
            x: 1,
            y: 0.5,
         }}
      >
         {children}
      </LinearGradient>
   );
});
