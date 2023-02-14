import { useEffect, useState } from "react";

import { getAllDataWithFilter } from "../../api";
import { Group, Institute } from "../../typings";
import { DB_PATHS, LFilter } from "../../typings/enums";
import { QUERIES } from "../../utils";

export const useGroups = (institutes: Institute[], filter: LFilter) => {
   const [groups, setGroups] = useState<Group[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         if (!!institutes.length && filter === LFilter.GROUPS) {
            setLoading(true);
            const q = QUERIES.CREATE_SIMPLE_QUERY<Group>(DB_PATHS.GROUPS, {
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
