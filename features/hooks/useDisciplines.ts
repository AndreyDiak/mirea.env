import { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getAllDataWithFilter, getDataById } from "../../api";
import { RootState } from "../../store";
import type { Discipline, FBDiscipline, FBGroup } from "../../typings";
import { DB_PATHS, USER_TYPE } from "../../typings/enums";
import { DisciplineConverter, QUERIES } from "../../utils";
import { isEmpty } from "../../utils/isEmpty";
import { selectDisciplines, setDisciplines } from "../slices/disciplinesSlice";
import { selectUser } from "../slices/userSlice";

interface UseDisciplines {
   disciplines: Discipline[];
   loading: boolean;
}

export function useDisciplines(): UseDisciplines {
   const user = useSelector(selectUser);

   const dispatch = useDispatch();

   const rawDisciplinesSelector = useCallback((s: RootState) => selectDisciplines(s), []);
   const rawDisciplines = useSelector(rawDisciplinesSelector);

   const [loading, setLoading] = useState<boolean>(false);

   const loadUserDisciplines = useCallback(
      async (instituteId: string) => {
         const q = QUERIES.CREATE_SIMPLE_QUERY<FBDiscipline>(DB_PATHS.DISCIPLINES, {
            fieldName: "institute_id",
            fieldValue: instituteId,
            opStr: "==",
         });
         const disciplines = await getAllDataWithFilter<FBDiscipline>(q);

         dispatch(setDisciplines({ disciplines }));
      },
      [dispatch],
   );

   const loadTeacherDisciplines = useCallback(
      async (disciplinesIds: string[]) => {
         setLoading(true);
         const disciplines = await Promise.all(
            disciplinesIds.map(async (disciplineId) => {
               const discipline = await getDataById<FBDiscipline>(disciplineId, DB_PATHS.DISCIPLINES);
               return discipline;
            }),
         );
         dispatch(setDisciplines({ disciplines }));
      },
      [dispatch],
   );

   useEffect(() => {
      const loadDisciplines = async () => {
         if (isEmpty(user)) return;
         setLoading(true);
         // первичная загрузка
         if (isEmpty(rawDisciplines)) {
            if (user.type === USER_TYPE.STUDENT) {
               await loadUserDisciplines(user.instituteId);
            } else if (user.type === USER_TYPE.TEACHER) {
               await loadTeacherDisciplines(user.disciplinesIds);
            }
         }
         setLoading(false);
      };
      loadDisciplines();
   }, [loadTeacherDisciplines, loadUserDisciplines, rawDisciplines, user]);

   return useMemo(() => {
      const disciplines = rawDisciplines ? DisciplineConverter.toData(rawDisciplines) : [];

      return {
         disciplines,
         loading,
      };
   }, [rawDisciplines, loading]);
}
