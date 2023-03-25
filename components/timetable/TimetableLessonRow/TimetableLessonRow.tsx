import React from "react";

import { Text, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { useTheme } from "../../../hooks";
import { PreviewLesson } from "../../../typings";
import { TimetableLessonRowAddData } from "./TimetableLessonRowAddData";
import { TimetableLessonRowTime } from "./TimetableLessonRowTime";

interface Props {
   lesson: PreviewLesson;
   lessonIndex: number;
}

export const TimetableLessonRow: React.FC<Props> = React.memo(({ lesson, lessonIndex }) => {
   const tw = useTailwind();
   const { APP_THEME_TEXT } = useTheme();

   return (
      <View style={tw("flex flex-row items-start py-4 overflow-hidden")}>
         <TimetableLessonRowTime index={lessonIndex} />
         <View style={tw("flex-1 flex flex-col justify-start")}>
            <Text
               style={[
                  tw("text-lg leading-5 font-bold"),
                  {
                     color: APP_THEME_TEXT,
                  },
               ]}
            >
               {lesson.name}
            </Text>
            <TimetableLessonRowAddData
               teachersNames={lesson.teachersNames}
               groupNames={lesson.groupNames}
               cabinet={lesson.cabinet}
            />
         </View>
      </View>
   );
});
