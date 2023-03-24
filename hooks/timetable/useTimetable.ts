import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { getAllDataWithFilter } from "../../api/queries/getAllDataWIthFilter";
import { selectUser } from "../../features/userSlice";
import { FBLesson, Timetable } from "../../typings";
import { DB_PATHS, USER_TYPE } from "../../typings/enums";
import { QUERIES } from "../../utils";
import { TimetableConverter } from "../../utils/Converter/TimetableConverter";

export const useTimetable = () => {
   const user = useSelector(selectUser);
   const [timeTable, setTimeTable] = useState<Timetable>(null);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         if (user.type === USER_TYPE.STUDENT) {
            setLoading(true);
            const q = QUERIES.CREATE_SIMPLE_QUERY<FBLesson>(DB_PATHS.TIMETABLES, {
               fieldName: "group_id",
               fieldValue: user.groupId,
               opStr: "==",
            });
            const data = await getAllDataWithFilter<FBLesson>(q);
            const timetable = TimetableConverter.toData(data);
            setTimeTable(timetable);
            setLoading(false);
         }
      };
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return { timeTable, loading };
};
