import React from "react";

import { Text, TouchableOpacity, View } from "react-native";

import { useTailwind } from "tailwind-rn/dist";

import { useTheme } from "../../hooks";
import { Day, TimetableDay } from "../../typings";

const daysPreview: Day[] = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

const dayToShortMap: Record<Day, string> = {
   Понедельник: "Пн",
   Вторник: "Вт",
   Среда: "Ср",
   Четверг: "Чт",
   Пятница: "Пт",
   Суббота: "Сб",
};

interface Props {
   dayIndex: number;
   setDayIndex: (dayIndex: number) => void;
}

export const TimeTableHeader: React.FC<Props> = React.memo(({ dayIndex, setDayIndex }) => {
   const tw = useTailwind();

   const { THEME_MAIN, APP_THEME_SECONDARY, APP_THEME_TEXT } = useTheme();

   return (
      <View
         style={{
            backgroundColor: APP_THEME_SECONDARY,
         }}
      >
         <View style={tw("p-2")}>
            <Text
               style={[
                  tw("font-bold"),
                  {
                     color: APP_THEME_TEXT,
                  },
               ]}
            >
               {daysPreview[dayIndex]}
            </Text>
         </View>
         <View style={tw("w-full flex flex-row")}>
            {daysPreview.map((day, index) => (
               <TouchableOpacity
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  onPress={() => setDayIndex(index)}
                  style={[
                     tw("flex items-center flex-grow py-2"),
                     {
                        minWidth: 50,
                     },
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
                     {dayToShortMap[day]}
                  </Text>
               </TouchableOpacity>
            ))}
         </View>
      </View>
   );
});
