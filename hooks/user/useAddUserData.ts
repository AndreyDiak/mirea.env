import { selectUser } from "./../../features/userSlice";
import { useEffect } from "react";
import { getDataById } from "../../api";
import { useState } from "react";
import { Discipline, Group } from "../../typings";
import { DBQueries, UType } from "../../typings/enums";
import { useSelector } from "react-redux";

export const useAddUserData = () => {
  const user = useSelector(selectUser);
  const [gName, setGName] = useState<string>(""); // group name
  const [dList, setDList] = useState<string[]>([]); // list of disciplines
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getData = async () => {
      if (user.type === UType.STUDENT) {
        setLoading(true);
        const group = await getDataById<Group>(user.groupId, DBQueries.GROUPS);
        setGName(group.name);
        setLoading(false);
      } else if (user.type === UType.TEACHER) {
        setLoading(true);
        const list = await Promise.all(
          user.disciplines.map(async (dId) => {
            const discipline = await getDataById<Discipline>(dId, DBQueries.DISCIPLINES);
            return discipline.name;
          })
        );
        setDList(list);
        setLoading(false);
      }
    };
    getData();
  }, []);

  return { groupName: gName, disciplinesList: dList, loading, uType: user.type };
};
