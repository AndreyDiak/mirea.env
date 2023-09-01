import { useCallback, useEffect, useMemo, useState } from "react";

import { getAllDataWithFilter } from "../../api";
import type { Discipline, FBDiscipline, Institute, UseCustomHook } from "../../typings";
import { DB_PATHS, LFilter } from "../../typings/enums";
import { DisciplineConverter, QUERIES, isEmpty } from "../../utils";

/*
 * загружает все предметы из firebase которые прикреплены к институтам,
 * которые мы получаем через параметры
 */

type FilteredDisciplines = Record<string, Discipline[]>;
interface UseDisciplines extends UseCustomHook {
   disciplines: FilteredDisciplines;
}

export function useFilteredDisciplines(institutes: Institute[], filter: LFilter): UseDisciplines {
   const [disciplines, setDisciplines] = useState<FilteredDisciplines>(null);
   const [loading, setLoading] = useState<boolean>(false);

   const loadFilteredDisciplines = useCallback(async () => {
      if (isEmpty(institutes) || filter !== LFilter.DISCIPLINES) return;

      setLoading(true);
      const initialDisiciplines: FilteredDisciplines = {};

      await Promise.all(
         institutes.map(async (institute) => {
            const q = QUERIES.CREATE_SIMPLE_QUERY<FBDiscipline>(DB_PATHS.DISCIPLINES, {
               fieldName: "institute_id",
               fieldValue: institute?.id,
               opStr: "==",
            });
            const rawDisciplines = await getAllDataWithFilter<FBDiscipline>(q);
            initialDisiciplines[institute.shortName] = DisciplineConverter.toData(rawDisciplines);
         }),
      );

      setDisciplines(initialDisiciplines);
      setLoading(false);
   }, [filter, institutes]);

   useEffect(() => {
      loadFilteredDisciplines();
   }, [loadFilteredDisciplines]);

   return useMemo(() => {
      return { disciplines, loading };
   }, [disciplines, loading]);
}
