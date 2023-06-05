import React, { useState } from "react";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { Error, Loader, ScreenTemplate, TimeTableHeader, TimeTableLessons } from "../components";
import { useTimetable } from "../features/hooks";
import { selectUser } from "../features/slices/userSlice";
import { useTheme } from "../hooks";
import { isEmpty } from "../utils";

export function TimeTableScreen() {
   const tw = useTailwind();

   const user = useSelector(selectUser);

   const { THEME } = useTheme();

   const { timetable, loading, dayIndex, setDayIndex } = useTimetable(user);

   if (isEmpty(timetable) && loading) {
      return <Loader text="Загрузка расписания" theme={THEME} />;
   }

   if (isEmpty(timetable)) {
      return <Error text="Расписание не найдено" theme={THEME} />;
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
