import { useEffect, useState } from "react";

import { getAllDataWithFilter } from "../../api";
import type { Discipline, Institute } from "../../typings";
import { DB_PATHS, LFilter } from "../../typings/enums";
import { QUERIES } from "../../utils";
import { isEmpty } from "../../utils/isEmpty";

export const useDisciplines = (institutes: Institute[], filter: LFilter) => {
   const [disciplines, setDisciplines] = useState<Record<string, Discipline[]>>(null);

   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         if (!isEmpty(institutes) && filter === LFilter.DISCIPLINES) {
            setLoading(true);
            const initialDisiciplines: Record<string, Discipline[]> = {};
            await Promise.all(
               institutes.map(async (institute) => {
                  const q = QUERIES.CREATE_SIMPLE_QUERY<Discipline>(DB_PATHS.DISCIPLINES, {
                     fieldName: "instituteId",
                     fieldValue: institute?.id,
                     opStr: "==",
                  });
                  const DBDisciplines = await getAllDataWithFilter<Discipline>(q);
                  initialDisiciplines[institute.shortName] = DBDisciplines;
               }),
            );

            setDisciplines(initialDisiciplines);
            setLoading(false);
         }
      };

      getData();
   }, [institutes, filter]);
   return { disciplines, loading };
};
