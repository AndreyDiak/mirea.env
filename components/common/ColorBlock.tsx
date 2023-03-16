import React from "react";

import { View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

interface Props {
   mainColor: string;
   secondColor: string;
   isBordered: boolean;
}

export const ColorBlock: React.FC<Props> = React.memo(({ mainColor, secondColor, isBordered }) => {
   const tw = useTailwind();
   return (
      <View
         style={[
            tw("w-12 h-8 rounded-md mr-4"),
            {
               backgroundColor: mainColor,
               borderWidth: 2,
               borderStyle: "solid",
               borderColor: isBordered ? secondColor : "transparent",
            },
         ]}
      />
   );
});
