import React from "react";

import { Text, View } from "react-native";

import { useTimetable } from "../../features/hooks";
import { Teacher, USER_TYPE } from "../../typings";
import { TimeTableHeader, TimeTableLessons } from "../timetable";

export function SearchModal({ teacher }: { teacher: Teacher }) {
   const { timetable, loading, dayIndex, setDayIndex } = useTimetable(teacher);

   // TODO @raymix разобраться как вставаить компонент TimetableLessons

   console.log(timetable?.days[dayIndex].lessons);

   return (
      <View>
         <TimeTableHeader dayIndex={dayIndex} setDayIndex={setDayIndex} />
         <TimeTableLessons lessons={timetable?.days[dayIndex].lessons} userType={USER_TYPE.TEACHER} />
      </View>
   );
}
