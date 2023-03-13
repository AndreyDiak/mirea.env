import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc } from "firebase/firestore";

import { AuthState } from "../../../features/authSlice";
import { auth } from "../../../firebase";
import type { Student, Teacher } from "../../../typings";
import { APP_THEME, DB_PATHS, UType } from "../../../typings/enums";
import { createCollection, isEmpty } from "../../../utils";

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

   let user: Omit<Student, "id"> | Omit<Teacher, "id">;

   if (userData.type === UType.STUDENT) {
      user = {
         email: userData.email,
         female: userData.female,
         img: "",
         name: userData.name,
         password: userData.password,
         theme: "blue",
         appTheme: APP_THEME.LIGHT,
         groupId: userData.group.id,
         instituteId: userData.institutes[0].id,
         type: UType.STUDENT,
      };
   } else {
      user = {
         email: userData.email,
         female: userData.female,
         img: "",
         name: userData.name,
         password: userData.password,
         theme: "blue",
         appTheme: APP_THEME.LIGHT,
         institutes: userData.institutes.map((institute) => institute.id),
         disciplines: userData.disciplines,
         type: UType.TEACHER,
      };
   }
   await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      .then(async () => {
         await addDoc(createCollection(DB_PATHS.USERS), {
            ...user,
         }).catch((e) => {
            setError(e.message);
         });
      })
      .catch((e) => {
         setError(e.message);
      });
};
