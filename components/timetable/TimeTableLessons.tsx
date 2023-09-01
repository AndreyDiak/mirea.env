import React from "react";

import { Text, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { usePreviewLessons, useTheme } from "../../hooks";
import { Lesson, USER_TYPE } from "../../typings";
import { isEmpty } from "../../utils";
import { Loader } from "../common";
import { TimetableLessonRow } from "./TimetableLessonRow/TimetableLessonRow";

interface Props {
   lessons: Lesson[];
   userType: USER_TYPE;
}

export const TimeTableLessons: React.FC<Props> = React.memo(({ lessons, userType }) => {
   const tw = useTailwind();

   const { previewLessons, loading } = usePreviewLessons(lessons, userType);

   const { THEME_MAIN } = useTheme();

   if (loading) {
      return <Loader text="Загрузка доп. данных" theme={THEME_MAIN} />;
   }

   if (isEmpty(previewLessons)) {
      return <Text>уроков нет</Text>;
   }

   return (
      <View style={tw("flex flex-col px-4")}>
         {previewLessons.map((lesson, index) => (
            <TimetableLessonRow key={Math.random()} lesson={lesson} lessonIndex={index} />
         ))}
      </View>
   );
});
