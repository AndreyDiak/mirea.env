import React from "react";

import { Text, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { useTheme } from "../../hooks";
import { ScreenTemplate } from "./ScreenTemplate";

interface Props {
   text: string;
   Icon: JSX.Element;
}

export const CenteredContent: React.FC<Props> = React.memo(({ text, Icon }) => {
   const tw = useTailwind();

   const { APP_THEME_TEXT } = useTheme();

   return (
      <View>
         <Text
            style={[
               tw("text-center mt-4 mb-2 text-xl font-semibold"),
               {
                  color: APP_THEME_TEXT,
               },
            ]}
         >
            {text}
         </Text>
         {Icon}
      </View>
   );
});

export const CenteredText: React.FC<Props> = React.memo(({ text, Icon }) => {
   const tw = useTailwind();

   return (
      <View style={tw("flex flex-col flex-1 justify-center items-center")}>
         <CenteredContent text={text} Icon={Icon} />
      </View>
   );
});

export const CenteredTextFullScreen: React.FC<Props> = React.memo(({ text, Icon }) => {
   const tw = useTailwind();

   return (
      <ScreenTemplate style={tw("flex flex-row justify-center items-center")}>
         <CenteredContent text={text} Icon={Icon} />
      </ScreenTemplate>
   );
});
