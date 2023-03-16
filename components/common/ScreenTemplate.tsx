import React, { useLayoutEffect } from "react";

import { StyleProp, ViewStyle } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";

import { selectUserAppTheme } from "../../features/userSlice";
import { returnAppTheme, returnLightenAppTheme } from "../../utils";

interface Props {
   children: JSX.Element;
   style?: StyleProp<ViewStyle>;
}

export const ScreenTemplate: React.FC<Props> = React.memo(({ children, style }) => {
   const appTheme = useSelector(selectUserAppTheme);

   const navigation = useNavigation();

   useLayoutEffect(() => {
      navigation.setOptions({
         headerStyle: {
            backgroundColor: returnLightenAppTheme(appTheme),
            // color: returnAppThemeText(appTheme),
         },
      });
   });

   return (
      <LinearGradient
         colors={[returnAppTheme(appTheme), returnAppTheme(appTheme)]}
         style={[
            style,
            {
               backgroundColor: returnAppTheme(appTheme),
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
