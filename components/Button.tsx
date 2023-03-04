import React from "react";

import { Text, TouchableOpacity } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

type Props = {
   title: string;
   callback: () => void;
   disabled?: boolean;
};

export function Button({ title, callback, disabled }: Props) {
   const tw = useTailwind();

   return (
      <TouchableOpacity disabled={disabled} style={tw("flex flex-row justify-center")} onPress={callback}>
         <Text
            style={tw(
               `px-3 py-2 text-white rounded-md font-semibold text-lg ${
                  disabled ? "bg-gray-400" : "bg-blue-400"
               }`,
            )}
         >
            {title}
         </Text>
      </TouchableOpacity>
   );
}

Button.defaultProps = {
   disabled: false,
};
