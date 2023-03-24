import { useEffect, useState } from "react";

import { getAllDataWithFilter } from "../../api";
import { FBGroup, Group, Institute } from "../../typings";
import { DB_PATHS, LFilter } from "../../typings/enums";
import { QUERIES } from "../../utils";
import { GroupConverter } from "../../utils/Converter/GroupConverter";
import { isEmpty } from "../../utils/isEmpty";

export const useGroups = (institutes: Institute[], filter: LFilter) => {
   const [groups, setGroups] = useState<Group[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         if (!isEmpty(institutes[0]) && filter === LFilter.GROUPS) {
            setLoading(true);
            const q = QUERIES.CREATE_SIMPLE_QUERY<FBGroup>(DB_PATHS.GROUPS, {
               fieldName: "institute_id",
               fieldValue: institutes[0]?.id,
               opStr: "==",
            });
            const FBGroups = await getAllDataWithFilter<FBGroup>(q);
            const Groups = GroupConverter.toData(FBGroups);
            setGroups(Groups);
            setLoading(false);
         }
      };

      getData();
   }, [institutes, filter]);
   return { groups, loading };
};
