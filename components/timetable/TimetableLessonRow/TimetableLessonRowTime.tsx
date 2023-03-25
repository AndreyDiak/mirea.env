import React from "react";

import { Text, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

const lessonIndexToTimeMap: Record<number, string> = {
   0: "09:00 10:30",
   1: "10:40 12:10",
   2: "12:40 14:10",
   3: "14:20 15:50",
   4: "16:20 17:50",
   5: "18:00 19:30",
};

export const TimetableLessonRowTime: React.FC<{ index: number }> = React.memo(({ index }) => {
   const tw = useTailwind();
   return (
      <View style={tw("mr-4 max-w-[70px] leading-5")}>
         <Text style={tw("font-bold text-gray-500")}>{lessonIndexToTimeMap[index]}</Text>
      </View>
   );
});
