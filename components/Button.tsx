import React from "react";

import { Text, TouchableOpacity } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { useTheme } from "../hooks";
import { COLORS_COMMON } from "../utils";

type Props = {
   title: string;
   callback: () => void;
   disabled?: boolean;
   disabledText?: string;
};

export function Button({ title, callback, disabled, disabledText }: Props) {
   const tw = useTailwind();

   const { THEME_MAIN } = useTheme();

   const backgroundColor = disabled ? COLORS_COMMON.DISABLED : THEME_MAIN;

   return (
      <TouchableOpacity disabled={disabled} style={tw("flex flex-row justify-center")} onPress={callback}>
         <Text
            style={[
               tw("px-3 py-2 text-white rounded-md font-semibold text-lg"),
               {
                  backgroundColor,
               },
            ]}
         >
            {disabled ? disabledText || "Загрузка..." : title}
         </Text>
      </TouchableOpacity>
   );
}

Button.defaultProps = {
   disabled: false,
   disabledText: "",
};
