import React from "react";

import { Text, TouchableOpacity } from "react-native";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserTheme } from "../features/userSlice";
import { COLORS_COMMON, returnHexCode } from "../utils";

type Props = {
   title: string;
   callback: () => void;
   disabled?: boolean;
   disabledText?: string;
};

export function Button({ title, callback, disabled, disabledText }: Props) {
   const tw = useTailwind();

   const theme = useSelector(selectUserTheme);

   const backgroundColor = disabled ? COLORS_COMMON.DISABLED : returnHexCode(theme);

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
            {disabled ? disabledText ?? "Загрузка..." : title}
         </Text>
      </TouchableOpacity>
   );
}

Button.defaultProps = {
   disabled: false,
   disabledText: "",
};
