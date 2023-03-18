import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { useTheme } from "../../hooks";
import { Day, LessonDay } from "../../typings";

const dayToShortMap: Record<Day, string> = {
   Понедельник: "Пн",
   Вторник: "Вт",
   Среда: "Ср",
   Четверг: "Чт",
   Пятница: "Пт",
   Суббота: "Сб",
};

interface Props {
   timetable: LessonDay[];
   dayIndex: number;
   setDayIndex: (dayIndex: number) => void;
}

export const TimeTableHeader: React.FC<Props> = React.memo(({ timetable, dayIndex, setDayIndex }) => {
   const tw = useTailwind();

   const { THEME_MAIN } = useTheme();

   return (
      <View style={tw("bg-white")}>
         <View style={tw("p-2")}>
            <Text style={tw("font-bold")}>{timetable[dayIndex].day}</Text>
         </View>
         <View style={tw("w-full flex flex-row")}>
            {timetable.map((day, index) => (
               <TouchableOpacity
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  onPress={() => setDayIndex(index)}
                  style={[
                     tw("flex items-center flex-grow py-2"),
                     index === dayIndex && {
                        borderBottomColor: THEME_MAIN,
                        borderBottomWidth: 3,
                     },
                  ]}
               >
                  <Text
                     style={{
                        fontWeight: "600",
                        color: THEME_MAIN,
                     }}
                  >
                     {dayToShortMap[day.day]}
                  </Text>
               </TouchableOpacity>
            ))}
         </View>
      </View>
   );
});
