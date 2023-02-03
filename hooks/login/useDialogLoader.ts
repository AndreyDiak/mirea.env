import { selectUserGroup, selectUserInstitutes } from "../../features/authSlice";
import { useSelector } from "react-redux";
import { selectUserDisciplines } from "../../features/authSlice";
import { LFilter } from "../../typings/enums";
import { useInstitutes } from "./useInstitutes";
import { useDisciplines } from "./useDisciplines";
import { useGroups } from "./useGroups";

export const useDialogLoader = (filter: LFilter) => {
  const myDisciplines = useSelector(selectUserDisciplines);
  const myInstitutes = useSelector(selectUserInstitutes);
  const myGroup = useSelector(selectUserGroup);

  const { institutes, loading: ILoading } = useInstitutes();

  const { disciplines, loading: DLoading } = useDisciplines(myInstitutes, filter);

  const { groups, loading: GLoading } = useGroups(myInstitutes, filter);

  const totalDisciplinesCount = !!disciplines
    ? Object.values(disciplines).reduce((total, d) => total + d.length, 0)
    : 0;

  const isDisabled =
    (filter === LFilter.DISCIPLINES && myDisciplines.length > 0 && totalDisciplinesCount > 0) ||
    (filter === LFilter.GROUPS && myGroup !== null && groups.length > 0) ||
    (filter === LFilter.INSTITUTES && myInstitutes.length > 0 && institutes.length > 0) ||
    (filter === LFilter.DISCIPLINES && totalDisciplinesCount === 0 && !DLoading) ||
    (filter === LFilter.GROUPS && groups.length === 0 && !GLoading) ||
    (filter === LFilter.INSTITUTES && institutes.length === 0 && !ILoading);

  return isDisabled;
};
