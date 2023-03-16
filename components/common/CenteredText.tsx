import React from "react";

import { Text, View } from "react-native";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserAppTheme } from "../../features/userSlice";
import { APP_THEME } from "../../typings/enums";
import { ScreenTemplate } from "./ScreenTemplate";

interface Props {
   text: string;
   Icon: JSX.Element;
}

export const CenteredText: React.FC<Props> = React.memo(({ text, Icon }) => {
   const tw = useTailwind();

   const appTheme = useSelector(selectUserAppTheme);

   return (
      <ScreenTemplate style={tw("flex flex-row justify-center items-center")}>
         <View>
            <Text
               style={[
                  tw("text-center mt-4 mb-2 text-xl font-semibold"),
                  {
                     color: appTheme === APP_THEME.LIGHT ? "black" : "white",
                  },
               ]}
            >
               {text}
            </Text>
            {Icon}
         </View>
      </ScreenTemplate>
   );
});
