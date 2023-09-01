import { useCallback, useEffect, useMemo, useState } from "react";

import { getAllDataWithFilter } from "../../api";
import { FBGroup, Group, Institute, UseCustomHook } from "../../typings";
import { DB_PATHS, LFilter } from "../../typings/enums";
import { QUERIES } from "../../utils";
import { GroupConverter } from "../../utils/Converter/GroupConverter";
import { isEmpty } from "../../utils/isEmpty";

interface UseGroups extends UseCustomHook {
   groups: Group[];
}

export function useFilteredGroups(institutes: Institute[], filter: LFilter): UseGroups {
   const [groups, setGroups] = useState<Group[]>([]);
   const [loading, setLoading] = useState<boolean>(false);

   const loadFilteredGroups = useCallback(async () => {
      if (isEmpty(institutes[0]) || filter !== LFilter.GROUPS) return;

      setLoading(true);

      const q = QUERIES.CREATE_SIMPLE_QUERY<FBGroup>(DB_PATHS.GROUPS, {
         fieldName: "institute_id",
         fieldValue: institutes[0]?.id,
         opStr: "==",
      });

      const rawGroups = await getAllDataWithFilter<FBGroup>(q);

      setGroups(GroupConverter.toData(rawGroups));
      setLoading(false);
   }, [filter, institutes]);

   useEffect(() => {
      loadFilteredGroups();
   }, [loadFilteredGroups]);

   return useMemo(() => {
      return { groups, loading };
   }, [groups, loading]);
}
