import React from "react";

import { View } from "react-native";

import { Skeleton } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

export function ProfileSkeleton() {
   const tw = useTailwind();
   return (
      <View style={tw("h-full w-full mt-10 px-4 flex flex-col justify-center")}>
         <View style={tw("flex flex-row justify-between mb-10")}>
            <Skeleton circle style={tw("w-20 h-20")} />
            <Skeleton style={tw("w-4/6 h-20 rounded-md")} />
         </View>
         <View style={tw("mb-10")}>
            <Skeleton style={tw("w-full h-40 rounded-lg")} />
         </View>
         <View>
            {Array(4)
               .fill(null)
               .map((_, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <View key={index} style={tw("flex flex-row justify-between mb-5")}>
                     <Skeleton style={tw("w-5/6 h-10 rounded-md")} />
                     <Skeleton circle style={tw("w-10 h-10")} />
                  </View>
               ))}
         </View>
      </View>
   );
}
