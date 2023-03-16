import React from "react";

import { Text, TouchableOpacity } from "react-native";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUserTheme } from "../features/userSlice";
import { returnHexCode } from "../utils";

type Props = {
   title: string;
   callback: () => void;
   disabled?: boolean;
};

export function Button({ title, callback, disabled }: Props) {
   const tw = useTailwind();

   const theme = useSelector(selectUserTheme);

   return (
      <TouchableOpacity disabled={disabled} style={tw("flex flex-row justify-center")} onPress={callback}>
         <Text
            style={[
               tw("px-3 py-2 text-white rounded-md font-semibold text-lg"),
               {
                  backgroundColor: disabled ? "#9ca3af" : returnHexCode(theme),
               },
            ]}
         >
            {title}
         </Text>
      </TouchableOpacity>
   );
}

Button.defaultProps = {
   disabled: false,
};
