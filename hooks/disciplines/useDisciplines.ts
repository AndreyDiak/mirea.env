import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllDataWithFilter, getDataById } from "../../api";
import type { Discipline, Group } from "../../typings";
import { DBQueries, UType } from "../../typings/enums";
import { QUERIES } from "../../utils";
import { selectUser } from "./../../features/userSlice";

export const useDisciplines = () => {
  const user = useSelector(selectUser);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (user) {
        if (user.type === UType.STUDENT) {
          // get our group id...
          const group = await getDataById<Group>(user.groupId, DBQueries.GROUPS);
          const q = QUERIES.CREATE_SIMPLE_QUERY<Discipline>(DBQueries.DISCIPLINES, {
            fieldName: "instituteId",
            fieldValue: group.instituteId,
            opStr: "==",
          });
          const disciplines = await getAllDataWithFilter<Discipline>(q);

          setDisciplines(disciplines);
        } else {
          const disciplines: Discipline[] = [];
          await Promise.all(
            user.disciplines.map(async (d) => {
              const discipline = await getDataById<Discipline>(d, DBQueries.DISCIPLINES);
              disciplines.push(discipline);
            })
          );
          setDisciplines(disciplines);
        }
        setLoading(false);
      }
    };
    getData();
  }, [user]);
  return { disciplines, loading };
};
