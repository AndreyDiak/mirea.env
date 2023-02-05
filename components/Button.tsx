import React from "react";

import { Text, TouchableOpacity } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

type Props = {
   title: string;
   callback: () => void;
};

export function Button({ title, callback }: Props) {
   const tw = useTailwind();

   return (
      <TouchableOpacity style={tw("flex flex-row justify-center")} onPress={callback}>
         <Text style={tw("bg-blue-400 px-3 py-2 text-white rounded-md font-semibold text-lg")}>
            {title}
         </Text>
      </TouchableOpacity>
   );
}
