import { useCallback, useEffect, useMemo, useState } from "react";

import { getAllDataWithFilter } from "../../api";
import { FBTeacher, Institute, Teacher, UseCustomHook } from "../../typings";
import { DB_PATHS, USER_TYPE } from "../../typings/enums";
import { QUERIES, UserConverter, isEmpty } from "../../utils";

interface UseTeachers extends UseCustomHook {
   teachers: Teacher[];
}

export const useFilteredTeachers = (institute: Institute): UseTeachers => {
   const [teachers, setTeachers] = useState<Teacher[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   const loadTeachers = useCallback(async () => {
      if (isEmpty(institute)) return;
      setLoading(true);

      const rawTeachers = await getAllDataWithFilter<FBTeacher>(
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

      setTeachers(
         rawTeachers.map((teacher) => ({
            ...UserConverter.toData(teacher),
         })) as Teacher[],
      );
      setLoading(false);
   }, [institute]);

   useEffect(() => {
      loadTeachers();
   }, [institute, loadTeachers]);

   return useMemo(() => {
      return { teachers, loading };
   }, [loading, teachers]);
};
