import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc } from "firebase/firestore";

import { AuthState } from "../../../features/authSlice";
import { auth } from "../../../firebase";
import type { AppUser } from "../../../typings";
import { APP_THEME, DB_PATHS, USER_THEME, UType } from "../../../typings/enums";
import { createCollection, isEmpty } from "../../../utils";
import { UserPatcher } from "../../../utils/Patcher/UserPatcher";

interface Props {
   userData: AuthState;
   setError: (error: string) => void;
}

export const createUser = async ({ userData, setError }: Props) => {
   setError("Создание аккаунта...");

   if (isEmpty(userData.name)) {
      setError("Введите имя");
      return;
   }
   if (isEmpty(userData.female)) {
      setError("Введите фамилию");
      return;
   }
   if (userData.type === UType.STUDENT && isEmpty(userData.group)) {
      setError("Выберите группу");
      return;
   }
   if (userData.type === UType.TEACHER && isEmpty(userData.disciplines)) {
      setError("Выберите дисциплины");
      return;
   }

   const user: AppUser = {
      email: userData.email,
      name: userData.name,
      female: userData.female,
      password: userData.password,
      appTheme: APP_THEME.LIGHT,
      theme: USER_THEME.BLUE,
      img: "",
      groupId: userData?.group?.id,
      instituteId: userData?.institutes[0].id,
      disciplinesIds: userData?.disciplines,
      institutesIds: userData?.institutes.map((institute) => institute.id),
      type: userData.type === UType.STUDENT ? UType.STUDENT : UType.TEACHER,
   };

   const fbUser = UserPatcher.toApiData(user);

   // if (userData.type === UType.STUDENT) {
   //    user = {
   //       email: userData.email,
   //       female: userData.female,
   //       img: "",
   //       name: userData.name,
   //       password: userData.password,
   //       theme: "blue",
   //       appTheme: APP_THEME.LIGHT,
   //       groupId: userData.group.id,
   //       instituteId: userData.institutes[0].id,
   //       type: UType.STUDENT,
   //    };
   // } else {
   //    user = {
   //       email: userData.email,
   //       female: userData.female,
   //       img: "",
   //       name: userData.name,
   //       password: userData.password,
   //       theme: "blue",
   //       appTheme: APP_THEME.LIGHT,
   //       institutes: userData.institutes.map((institute) => institute.id),
   //       disciplines: userData.disciplines,
   //       type: UType.TEACHER,
   //    };
   // }
   await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      .then(async () => {
         await addDoc(createCollection(DB_PATHS.USERS), {
            ...fbUser,
         }).catch((e) => {
            setError(e.message);
         });
      })
      .catch((e) => {
         setError(e.message);
      });
};
