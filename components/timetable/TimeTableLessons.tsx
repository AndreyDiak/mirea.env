import React from "react";

import { View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { usePreviewLessons } from "../../hooks";
import { Lesson } from "../../typings";
import { isEmpty } from "../../utils";
import { Loader } from "../common";
import { TimetableLessonRow } from "./TimetableLessonRow/TimetableLessonRow";

interface Props {
   lessons: Lesson[];
   dayIndex: number;
}

export const TimeTableLessons: React.FC<Props> = React.memo(({ lessons }) => {
   const tw = useTailwind();

   const { previewLessons, loading } = usePreviewLessons(lessons);

   if (loading) {
      return <Loader text="Загрузка доп. данных" />;
   }

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
