import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { getAllDataWithFilter, getDataById } from "../../api";
import { selectUser } from "../../features/userSlice";
import type { Discipline, Group } from "../../typings";
import { DB_PATHS, UType } from "../../typings/enums";
import { QUERIES } from "../../utils";

export const useDisciplines = () => {
   const user = useSelector(selectUser);

   const [disciplines, setDisciplines] = useState<Discipline[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         setLoading(true);
         if (user) {
            if (user.type === UType.STUDENT) {
               // get our group id...
               const group = await getDataById<Group>(user.groupId, DB_PATHS.GROUPS);
               const q = QUERIES.CREATE_SIMPLE_QUERY<Discipline>(DB_PATHS.DISCIPLINES, {
                  fieldName: "instituteId",
                  fieldValue: group.instituteId,
                  opStr: "==",
               });
               const DBdisciplines = await getAllDataWithFilter<Discipline>(q);

               setDisciplines(DBdisciplines);
            } else {
               const DBdisciplines: Discipline[] = [];
               await Promise.all(
                  user.disciplines.map(async (d) => {
                     const discipline = await getDataById<Discipline>(d, DB_PATHS.DISCIPLINES);
                     DBdisciplines.push(discipline);
                  }),
               );
               setDisciplines(DBdisciplines);
            }
            setLoading(false);
         }
      };
      getData();
   }, [user]);
   return { disciplines, loading };
};
