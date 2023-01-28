import { useEffect, useState } from "react";
import { DBQueries, LFilter } from "../../typings/enums";
import { getAllDataWithFilter } from "./../../api/queries/getAllDataWIthFilter";

export const useDisciplines = (institutes: Institute[], filter: LFilter) => {
  const [disciplines, setDisciplines] =
    useState<Record<string, Discipline[]>>(null);

  const [loading, setLoading] = useState<boolean>(false);

  console.log({ institutes });
  console.log({ filter });
  useEffect(() => {
    const getData = async () => {
      if (!!institutes.length && filter === LFilter.DISCIPLINES) {
        console.log("recalculate");
        setLoading(true);
        let initialDisiciplines: Record<string, Discipline[]> = {};
        await Promise.all(
          institutes.map(async (institute) => {
            const DBDisciplines = await getAllDataWithFilter<Discipline>(
              DBQueries.DISCIPLINES,
              "instituteId",
              institute.id
            );
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
