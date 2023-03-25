import React, { ReactNode, useMemo } from "react";

import { Text, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { useTheme } from "../../hooks";
import { COLORS_COMMON } from "../../typings";

type LabelType = "secondary" | "user_theme";

const typeToBackgroundMap: Record<LabelType, string> = {
   secondary: COLORS_COMMON.DISABLED,
   user_theme: "",
};

interface Props {
   type: LabelType;
   content: ReactNode;
}

export const Label: React.FC<Props> = React.memo(({ type, content }) => {
   const { APP_THEME_MAIN, THEME_MAIN } = useTheme();

   const backgroundColor = useMemo(() => {
      if (type === "user_theme") {
         return THEME_MAIN;
      }
      return typeToBackgroundMap[type];
   }, [THEME_MAIN, type]);

   const tw = useTailwind();

   return (
      <View
         style={[
            tw("py-1 px-2 rounded-md"),
            {
               backgroundColor,
            },
         ]}
      >
         <Text
            style={[
               tw("font-bold"),
               {
                  color: APP_THEME_MAIN,
               },
            ]}
         >
            {content}
         </Text>
      </View>
   );
});
