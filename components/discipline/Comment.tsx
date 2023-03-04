import React from "react";

import { Text, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import type { DBComment } from "../../typings";

type Props = {
   comment: DBComment;
   index: number;
   isLast: boolean;
};

export const Comment: React.FC<Props> = React.memo(({ comment, index, isLast }) => {
   const tw = useTailwind();

   return (
      <View style={tw("w-full")}>
         <View style={tw("w-full bg-gray-50 p-4 rounded-sm")}>
            <Text style={tw("mb-2")}>{comment.text}</Text>
            <Text style={tw("text-right text-xs")}>{comment.email}</Text>
         </View>
         {!isLast && (
            <View style={tw(`flex flex-row px-8 ${index % 2 === 0 ? "justify-start" : "justify-end"}`)}>
               <View style={tw("bg-gray-300 w-0.5 rounded-md h-4 my-1")} />
            </View>
         )}
      </View>
   );
});
