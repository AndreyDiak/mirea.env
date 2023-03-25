import React, { useState } from "react";

import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { Error, Loader, ScreenTemplate, TimeTableHeader, TimeTableLessons } from "../components";
import { selectUserTheme } from "../features/userSlice";
import { useTimetable } from "../hooks";
import { isEmpty } from "../utils";

export function TimeTableScreen() {
   const tw = useTailwind();

   const [dayIndex, setDayIndex] = useState(0);

   const theme = useSelector(selectUserTheme);

   const { timetable, loading } = useTimetable();

   if (isEmpty(timetable) && loading) {
      return <Loader text="Загрузка расписания" theme={theme} />;
   }

   if (isEmpty(timetable)) {
      return <Error text="Расписание не найдено" theme={theme} />;
   }

   return (
      <ScreenTemplate style={tw("py-8")}>
         <>
            <TimeTableHeader dayIndex={dayIndex} setDayIndex={setDayIndex} />
            <TimeTableLessons lessons={timetable.days[dayIndex].lessons} dayIndex={dayIndex} />
         </>
      </ScreenTemplate>
   );
}
