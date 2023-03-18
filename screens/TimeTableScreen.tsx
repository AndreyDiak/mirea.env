import React, { useState } from "react";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { Error, Loader, ScreenTemplate, TimeTableHeader, TimeTableLessons } from "../components";
import { selectUserTheme } from "../features/userSlice";
import { useTimetable } from "../hooks/timetable/useTimetable";
import { isEmpty } from "../utils";

export function TimeTableScreen() {
   const tw = useTailwind();

   const [dayIndex, setDayIndex] = useState(0);

   const theme = useSelector(selectUserTheme);

   const { timeTable, loading } = useTimetable();

   if (isEmpty(timeTable) && loading) {
      return <Loader text="Загрузка расписания" theme={theme} />;
   }

   if (isEmpty(timeTable)) {
      return <Error text="Расписание не найдено" theme={theme} />;
   }

   return (
      <ScreenTemplate style={tw("py-8")}>
         <>
            <TimeTableHeader timetable={timeTable?.timetable} dayIndex={dayIndex} setDayIndex={setDayIndex} />
            <TimeTableLessons timetable={timeTable?.timetable} dayIndex={dayIndex} />
         </>
      </ScreenTemplate>
   );
}
