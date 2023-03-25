import React from "react";

import { Text, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { usePreviewLessons, useTheme } from "../../hooks";
import { Lesson } from "../../typings";
import { isEmpty } from "../../utils";
import { Loader } from "../common";

const lessonIndexToTimeMap: Record<number, string> = {
   0: "09:00 10:30",
   1: "10:40 12:10",
   2: "12:40 14:10",
   3: "14:20 15:50",
   4: "16:20 17:50",
   5: "18:00 19:30",
};

interface Props {
   lessons: Lesson[]; // @raymix TODO Lesson[] => PreviewLesson[]
   dayIndex: number;
}

export const TimeTableLessons: React.FC<Props> = React.memo(({ lessons }) => {
   const tw = useTailwind();

   const { APP_THEME_TEXT } = useTheme();

   const { previewLessons, loading } = usePreviewLessons(lessons);

   // сделать хук которые будет возвращать PreviewLesson уже с именами учителей

   if (loading) {
      return <Loader text="Загрузка доп. данных" />;
   }

   if (isEmpty(previewLessons)) {
      return null;
   }

   return (
      <View style={tw("flex flex-col px-4")}>
         {previewLessons.map((lesson, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <View key={index} style={tw("flex flex-row py-4 mb-4 overflow-hidden")}>
               <View style={tw("mr-4 max-w-[70px]")}>
                  <Text style={tw("font-bold text-gray-500")}>{lessonIndexToTimeMap[index]}</Text>
               </View>
               <View style={tw("flex-1")}>
                  <Text
                     style={[
                        tw("text-lg font-semibold mb-1"),
                        {
                           color: APP_THEME_TEXT,
                        },
                     ]}
                  >
                     {lesson.name}
                  </Text>
                  <View style={tw("flex-row justify-between")}>
                     <Text style={tw("text-gray-500 font-bold")}>{lesson.cabinet}</Text>
                     <View>
                        {lesson.teachersNames.map((teacherName) => (
                           <Text style={{ color: APP_THEME_TEXT }} key={teacherName}>
                              {teacherName}
                           </Text>
                        ))}
                     </View>
                  </View>
               </View>
            </View>
         ))}
      </View>
   );
});
