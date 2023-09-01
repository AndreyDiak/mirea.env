import React from "react";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import {
   FullScreenError,
   FullScreenLoader,
   ScreenTemplate,
   TimeTableHeader,
   TimeTableLessons,
} from "../components";
import { useTimetable } from "../features/hooks";
import { selectUser } from "../features/slices/userSlice";
import { useTheme } from "../hooks";
import { isEmpty } from "../utils";

export function TimeTableScreen() {
   const tw = useTailwind();

   const user = useSelector(selectUser);

   const { THEME_MAIN } = useTheme();

   const { timetable, loading, dayIndex, setDayIndex } = useTimetable(user);

   if (isEmpty(timetable) && loading) {
      return <FullScreenLoader text="Загрузка расписания" theme={THEME_MAIN} />;
   }

   if (isEmpty(timetable)) {
      return <FullScreenError text="Расписание не найдено" theme={THEME_MAIN} />;
   }

   return (
      <ScreenTemplate style={tw("py-8")}>
         <>
            <TimeTableHeader dayIndex={dayIndex} setDayIndex={setDayIndex} />
            <TimeTableLessons lessons={timetable.days[dayIndex].lessons} userType={user.type} />
         </>
      </ScreenTemplate>
   );
}
