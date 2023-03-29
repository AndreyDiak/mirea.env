import { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getAllDataWithFilter, getDataById } from "../../api";
import { selectDisciplines, setDisciplines } from "../../features/slices/disciplinesSlice";
import { selectUser } from "../../features/slices/userSlice";
import { RootState } from "../../store";
import type { Discipline, FBDiscipline, FBGroup } from "../../typings";
import { DB_PATHS, USER_TYPE } from "../../typings/enums";
import { DisciplineConverter, QUERIES } from "../../utils";
import { isEmpty } from "../../utils/isEmpty";

interface UseDisciplines {
   disciplines: Discipline[];
   loading: boolean;
}

export function useDisciplines(): UseDisciplines {
   const user = useSelector(selectUser);

   const dispatch = useDispatch();

   const rawDisciplinesSelector = useCallback((s: RootState) => selectDisciplines(s), []);
   const rawDisciplines = useSelector(rawDisciplinesSelector);

   // const [disciplines, setDisciplines] = useState<Discipline[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   const loadUserDisciplines = useCallback(
      async (groupId: string) => {
         const FBGroup = await getDataById<FBGroup>(groupId, DB_PATHS.GROUPS);
         const q = QUERIES.CREATE_SIMPLE_QUERY<FBDiscipline>(DB_PATHS.DISCIPLINES, {
            fieldName: "institute_id",
            fieldValue: FBGroup.institute_id,
            opStr: "==",
         });
         const disciplines = await getAllDataWithFilter<FBDiscipline>(q);
         dispatch(setDisciplines({ disciplines }));
      },
      [dispatch],
   );

   const loadTeacherDisciplines = useCallback(
      async (disciplinesIds: string[]) => {
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
      if (isEmpty(user)) return;

      // первичная загрузка
      if (isEmpty(rawDisciplines)) {
         setLoading(true);
         if (user.type === USER_TYPE.STUDENT) {
            loadUserDisciplines(user.groupId);
         } else if (user.type === USER_TYPE.TEACHER) {
            loadTeacherDisciplines(user.disciplinesIds);
         }
         setLoading(false);
      }
   }, [loadTeacherDisciplines, loadUserDisciplines, rawDisciplines, user]);

   return useMemo(() => {
      const disciplines = rawDisciplines ? DisciplineConverter.toData(rawDisciplines) : [];

      return {
         disciplines,
         loading,
      };
   }, [rawDisciplines, loading]);
}
