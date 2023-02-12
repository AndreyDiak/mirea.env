import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { getAllDataWithFilter } from "../../api/queries/getAllDataWIthFilter";
import { selectUser } from "../../features/userSlice";
import { TimeTable } from "../../typings";
import { DBQueries, UType } from "../../typings/enums";
import { QUERIES } from "../../utils";

export const useTimetable = () => {
   const user = useSelector(selectUser);
   const [timeTable, setTimeTable] = useState<TimeTable>(null);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         if (user.type === UType.STUDENT) {
            setLoading(true);
            const q = QUERIES.CREATE_SIMPLE_QUERY<TimeTable>(DBQueries.TIMETABLES, {
               fieldName: "groupId",
               fieldValue: user.groupId,
               opStr: "==",
            });
            const data = await getAllDataWithFilter<TimeTable>(q);
            setTimeTable(data[0]);
            setLoading(false);
         }
      };
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return { timeTable, loading };
};
