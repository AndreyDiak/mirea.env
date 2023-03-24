import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { getAllDataWithFilter, getDataById } from "../../api";
import { selectUser } from "../../features/userSlice";
import type { Discipline, FBDiscipline, FBGroup, Group } from "../../typings";
import { DB_PATHS, USER_TYPE } from "../../typings/enums";
import { QUERIES } from "../../utils";
import { DisciplineConverter } from "../../utils/Converter/DisciplineConverter";

export const useDisciplines = () => {
   const user = useSelector(selectUser);

   const [disciplines, setDisciplines] = useState<Discipline[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         setLoading(true);
         if (user) {
            if (user.type === USER_TYPE.STUDENT) {
               // get our group id...
               const FBGroup = await getDataById<FBGroup>(user.groupId, DB_PATHS.GROUPS);
               const q = QUERIES.CREATE_SIMPLE_QUERY<FBDiscipline>(DB_PATHS.DISCIPLINES, {
                  fieldName: "institute_id",
                  fieldValue: FBGroup.institute_id,
                  opStr: "==",
               });
               const FBDisciplines = await getAllDataWithFilter<FBDiscipline>(q);

               setDisciplines(DisciplineConverter.toData(FBDisciplines));
            } else if (user.type === USER_TYPE.TEACHER) {
               const DBdisciplines: Discipline[] = [];
               await Promise.all(
                  user?.disciplinesIds.map(async (d) => {
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
