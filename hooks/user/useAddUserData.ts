import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { getDataById } from "../../api";
import { selectUser } from "../../features/userSlice";
import { Discipline, Group, Student, Teacher } from "../../typings";
import { DB_PATHS, UType } from "../../typings/enums";

export const useAddUserData = () => {
   const user = useSelector(selectUser);
   const [gName, setGName] = useState<string>(""); // group name
   const [dList, setDList] = useState<string[]>([]); // list of disciplines
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         if (user.type === UType.STUDENT) {
            setLoading(true);
            const group = await getDataById<Group>(user.groupId, DB_PATHS.GROUPS);
            setGName(group.name);
            setLoading(false);
         } else if (user.type === UType.TEACHER) {
            setLoading(true);
            const list = await Promise.all(
               user?.disciplines.map(async (dId) => {
                  const discipline = await getDataById<Discipline>(dId, DB_PATHS.DISCIPLINES);
                  return discipline.name;
               }),
            );
            setDList(list);
            setLoading(false);
         }
      };
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [(user as Teacher).disciplines, (user as Student).groupId, user.type]);

   return {
      groupName: gName,
      disciplinesList: dList,
      loading,
      uType: user.type,
   };
};
