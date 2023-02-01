import { useEffect, useState } from "react";
import { Group, Institute } from "../../typings";
import { DBQueries, LFilter } from "../../typings/enums";
import { getAllDataWithFilter } from "./../../api";

export const useGroups = (institutes: Institute[], filter: LFilter) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      if (!!institutes.length && filter === LFilter.GROUPS) {
        setLoading(true);

        const DBGroups = await getAllDataWithFilter<Group>(
          DBQueries.GROUPS,
          "instituteId",
          institutes[0].id
        );

        setGroups(DBGroups);
        setLoading(false);
      }
    };

    getData();
  }, [institutes, filter]);
  return { groups, loading };
};
