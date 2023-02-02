import { useEffect, useState } from "react";
import type { Discipline, Institute } from "../../typings";
import { DBQueries, LFilter } from "../../typings/enums";
import { QUERIES } from "../../utils";
import { getAllDataWithFilter } from "./../../api";

export const useDisciplines = (institutes: Institute[], filter: LFilter) => {
  const [disciplines, setDisciplines] = useState<Record<string, Discipline[]>>(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      if (!!institutes.length && filter === LFilter.DISCIPLINES) {
        setLoading(true);
        let initialDisiciplines: Record<string, Discipline[]> = {};
        await Promise.all(
          institutes.map(async (institute) => {
            const q = QUERIES.CREATE_SIMPLE_QUERY<Discipline>(DBQueries.DISCIPLINES, {
              fieldName: "instituteId",
              fieldValue: institute.id,
              opStr: "==",
            });
            const DBDisciplines = await getAllDataWithFilter<Discipline>(q);
            initialDisiciplines[institute.shortName] = DBDisciplines;
          })
        );

        setDisciplines(initialDisiciplines);
        setLoading(false);
      }
    };

    getData();
  }, [institutes, filter]);
  return { disciplines, loading };
};
