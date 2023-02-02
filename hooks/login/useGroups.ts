import { useEffect, useState } from "react";
import { Group, Institute } from "../../typings";
import { DBQueries, LFilter } from "../../typings/enums";
import { QUERIES } from "../../utils";
import { getAllDataWithFilter } from "./../../api";

export const useGroups = (institutes: Institute[], filter: LFilter) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      if (!!institutes.length && filter === LFilter.GROUPS) {
        setLoading(true);
        const q = QUERIES.CREATE_SIMPLE_QUERY<Group>(DBQueries.GROUPS, {
          fieldName: "instituteId",
          fieldValue: institutes[0].id,
          opStr: "==",
        });
        const DBGroups = await getAllDataWithFilter<Group>(q);

        setGroups(DBGroups);
        setLoading(false);
      }
    };

    getData();
  }, [institutes, filter]);
  return { groups, loading };
};
