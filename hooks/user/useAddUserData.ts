import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { getDataById } from "../../api";
import { selectUser } from "../../features/slices/userSlice";
import { FBDiscipline, FBGroup, FBInstitute, Student, Teacher } from "../../typings";
import { DB_PATHS, USER_TYPE } from "../../typings/enums";

interface UseAddUserData {
   groupName: string; // имя группы (для ученика)
   institutes: string[]; // short_name институтов
   disciplines: string[]; // название дисциплин (для учителя)
   loading: boolean;
   userType: USER_TYPE;
}

export function useAddUserData(): UseAddUserData {
   const user = useSelector(selectUser);
   const [groupName, setGroupName] = useState<string>(""); // group name
   const [institutes, setInstitutes] = useState<string[]>([]);
   const [disciplines, setDisciplines] = useState<string[]>([]); // list of disciplines
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      const getData = async () => {
         if (user.type === USER_TYPE.STUDENT) {
            setLoading(true);

            const group = await getDataById<FBGroup>(user.groupId, DB_PATHS.GROUPS);
            const institute = await getDataById<FBInstitute>(user.instituteId, DB_PATHS.INSTITUTES);

            setGroupName(group.name);
            setInstitutes([institute.short_name]);

            setLoading(false);
         } else if (user.type === USER_TYPE.TEACHER) {
            setLoading(true);

            const newDisciplines = await Promise.all(
               user?.disciplinesIds.map(async (dId) => {
                  const discipline = await getDataById<FBDiscipline>(dId, DB_PATHS.DISCIPLINES);
                  return discipline.name;
               }),
            );
            setDisciplines(newDisciplines);

            const newInstitutes = await Promise.all(
               user.institutesIds.map(async (instituteId) => {
                  const institute = await getDataById<FBInstitute>(instituteId, DB_PATHS.INSTITUTES);
                  return institute.short_name;
               }),
            );

            setInstitutes(newInstitutes);
            setLoading(false);
         }
      };
      getData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [(user as Teacher).disciplinesIds, (user as Student).groupId, user.type]);

   return {
      groupName,
      institutes,
      disciplines,
      loading,
      userType: user.type,
   };
}
