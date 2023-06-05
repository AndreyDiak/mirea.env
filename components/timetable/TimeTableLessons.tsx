import React from "react";

import { View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { usePreviewLessons } from "../../hooks";
import { Lesson, USER_TYPE } from "../../typings";
import { isEmpty } from "../../utils";
import { TimetableLessonRow } from "./TimetableLessonRow/TimetableLessonRow";

interface Props {
   lessons: Lesson[];
   userType: USER_TYPE;
}

export const TimeTableLessons: React.FC<Props> = React.memo(({ lessons, userType }) => {
   const tw = useTailwind();

   const { previewLessons, loading } = usePreviewLessons(lessons, userType);

   // if (loading) {
   //    return <Loader text="Загрузка доп. данных" />;
   // }

   if (isEmpty(previewLessons)) {
      return null;
   }

   return (
      <View style={tw("flex flex-col px-4")}>
         {previewLessons.map((lesson, index) => (
            <TimetableLessonRow key={Math.random()} lesson={lesson} lessonIndex={index} />
         ))}
      </View>
   );
});
