import { useEffect, useState } from "react";

import { getAllDataWithFilter } from "../../api";
import { Institute, Teacher } from "../../typings";
import { DBQueries, UType } from "../../typings/enums";
import { QUERIES } from "../../utils";

export const useTeachers = (institute: Institute) => {
   const [teachers, setTeachers] = useState<Teacher[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         if (institute) {
            setLoading(true);
            const DBTeachers = await getAllDataWithFilter<Teacher>(
               QUERIES.CREATE_MULTIPLE_QUERY<Teacher>(DBQueries.USERS, [
                  {
                     fieldName: "type",
                     fieldValue: UType.TEACHER,
                     opStr: "==",
                  },
                  {
                     fieldName: "institutes",
                     fieldValue: institute.id,
                     opStr: "array-contains",
                  },
               ]),
            );
            setTeachers(DBTeachers);
            setLoading(false);
         }
      };
      getData();
   }, [institute]);
   return { teachers, loading };
};
