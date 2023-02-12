import React from "react";

import { Text, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { LessonDay } from "../../typings";

const lessonIndexToTimeMap: Record<number, string> = {
   0: "09:00 10:30",
   1: "10:40 12:10",
   2: "12:40 14:10",
   3: "14:20 15:50",
   4: "16:20 17:50",
   5: "18:00 19:30",
};

interface Props {
   timetable: LessonDay[];
   dayIndex: number;
}

export const TimeTableLessons: React.FC<Props> = React.memo(({ timetable, dayIndex }) => {
   const tw = useTailwind();
   return (
      <View style={tw("flex flex-col px-4")}>
         {timetable[dayIndex].lessons.map((lesson, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <View key={index} style={tw("flex flex-row py-4 mb-4")}>
               <View style={tw("mr-4 max-w-[70px]")}>
                  <Text style={tw("font-bold text-gray-500")}>{lessonIndexToTimeMap[index]}</Text>
               </View>
               <View>
                  <Text style={tw("text-xl font-semibold")}>{lesson}</Text>
               </View>
            </View>
         ))}
      </View>
   );
});
