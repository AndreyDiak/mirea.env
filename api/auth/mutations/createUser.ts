import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc } from "firebase/firestore";

import { AuthState } from "../../../features/slices/authSlice";
import { auth } from "../../../firebase";
import type { AppUser } from "../../../typings";
import { APP_THEME, DB_PATHS, USER_THEME, USER_TYPE } from "../../../typings/enums";
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
   if (userData.type === USER_TYPE.STUDENT && isEmpty(userData.group)) {
      setError("Выберите группу");
      return;
   }
   if (userData.type === USER_TYPE.TEACHER && isEmpty(userData.disciplines)) {
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
      type: userData.type === USER_TYPE.STUDENT ? USER_TYPE.STUDENT : USER_TYPE.TEACHER,
   };

   const fbUser = UserPatcher.toApiData(user);

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
