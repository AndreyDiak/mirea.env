import { useEffect, useState } from "react";

import { getAllDataWithFilter } from "../../api";
import { FBTeacher, Institute, Teacher } from "../../typings";
import { DB_PATHS, USER_TYPE } from "../../typings/enums";
import { QUERIES, UserConverter } from "../../utils";

export const useTeachers = (institute: Institute) => {
   const [teachers, setTeachers] = useState<Teacher[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         if (institute) {
            setLoading(true);
            const FBTeachers = await getAllDataWithFilter<FBTeacher>(
               QUERIES.CREATE_MULTIPLE_QUERY<FBTeacher>(DB_PATHS.USERS, [
                  {
                     fieldName: "type",
                     fieldValue: USER_TYPE.TEACHER,
                     opStr: "==",
                  },
                  {
                     fieldName: "institutes_ids",
                     fieldValue: institute.id,
                     opStr: "array-contains",
                  },
               ]),
            );
            const Teachers = FBTeachers.map((teacher) => ({
               ...UserConverter.toData(teacher),
            }));
            setTeachers(Teachers);
            setLoading(false);
         }
      };
      getData();
   }, [institute]);
   return { teachers, loading };
};
