import { getUser } from "./../../features/userSlice";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { DBQueries } from "../../typings/enums";
import { getAllDataWithFilter, getDataById } from "../../api";

export const useDisciplines = () => {
  const user = useSelector(getUser);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (user) {
        if (user.type === "student") {
          // get our group id...
          const group = await getDataById<Group>(user.groupId, DBQueries.GROUPS);

          const disciplines = await getAllDataWithFilter<Discipline>(
            DBQueries.DISCIPLINES,
            "instituteId",
            group.instituteId
          );

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
