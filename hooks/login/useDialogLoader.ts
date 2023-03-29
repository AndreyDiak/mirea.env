import { useMemo } from "react";

import { useSelector } from "react-redux";

import {
   selectUserDisciplines,
   selectUserGroup,
   selectUserInstitutes,
} from "../../features/slices/authSlice";
import { LFilter } from "../../typings/enums";
import { isEmpty } from "../../utils";
import { useDisciplines } from "./useDisciplines";
import { useGroups } from "./useGroups";
import { useInstitutes } from "./useInstitutes";

export const useDialogLoader = (filter: LFilter) => {
   const myDisciplines = useSelector(selectUserDisciplines);
   const myInstitutes = useSelector(selectUserInstitutes);
   const myGroup = useSelector(selectUserGroup);

   const { institutes, loading: ILoading } = useInstitutes();

   const { disciplines, loading: DLoading } = useDisciplines(myInstitutes, filter);

   const { groups, loading: GLoading } = useGroups(myInstitutes, filter);

   const totalDisciplinesCount = useMemo(
      () => (disciplines ? Object.values(disciplines).reduce((total, d) => total + d.length, 0) : 0),
      [disciplines],
   );

   const loaderStatus =
      (filter === LFilter.DISCIPLINES && !isEmpty(myDisciplines) && !isEmpty(totalDisciplinesCount)) ||
      (filter === LFilter.GROUPS && !isEmpty(myGroup) && !isEmpty(groups)) ||
      (filter === LFilter.INSTITUTES && !isEmpty(myInstitutes) && !isEmpty(institutes)) ||
      (filter === LFilter.DISCIPLINES && isEmpty(totalDisciplinesCount) && !DLoading) ||
      (filter === LFilter.GROUPS && isEmpty(groups) && !GLoading) ||
      (filter === LFilter.INSTITUTES && isEmpty(institutes) && !ILoading);

   return loaderStatus;
};
