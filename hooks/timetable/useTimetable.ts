import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { getAllDataWithFilter } from "../../api/queries/getAllDataWIthFilter";
import { selectUser } from "../../features/slices/userSlice";
import { FBLesson, Timetable } from "../../typings";
import { DB_PATHS, USER_TYPE } from "../../typings/enums";
import { QUERIES, TimetableConverter } from "../../utils";

export const useTimetable = () => {
   const user = useSelector(selectUser);
   const [timetable, setTimeable] = useState<Timetable>(null);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         setLoading(true);
         if (user.type === USER_TYPE.STUDENT) {
            // подгрузка расписания для студента
            const q = QUERIES.CREATE_SIMPLE_QUERY<FBLesson>(DB_PATHS.TIMETABLES, {
               fieldName: "groups_ids",
               fieldValue: user.groupId,
               opStr: "array-contains",
            });
            const data = await getAllDataWithFilter<FBLesson>(q);
            const newTimetable = TimetableConverter.toData(data, user.groupId);
            setTimeable(newTimetable);
         } else {
            // подгрузка расписания для препода
            const q = QUERIES.CREATE_SIMPLE_QUERY<FBLesson>(DB_PATHS.TIMETABLES, {
               fieldName: "teachers_ids",
               fieldValue: user.id,
               opStr: "array-contains",
            });
            const data = await getAllDataWithFilter<FBLesson>(q);
            const newTimetable = TimetableConverter.toData(data, "");
            setTimeable(newTimetable);
         }

         setLoading(false);
      };
      getData();

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [user.id, user.type]);

   return { timetable, loading };
};
