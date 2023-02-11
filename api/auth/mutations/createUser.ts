import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc } from "firebase/firestore";

import { AuthState } from "../../../features/authSlice";
import { auth } from "../../../firebase";
import type { Student, Teacher } from "../../../typings";
import { DBQueries, UType } from "../../../typings/enums";
import { createCollection } from "../../../utils";

interface Props {
   userData: AuthState;
   setError: (error: string) => void;
}

export const createUser = async ({ userData, setError }: Props) => {
   setError("Создание аккаунта...");

   if (userData.name === null || userData.name === "") {
      setError("Введите имя");
      return;
   }
   if (userData.female === null || userData.female === "") {
      setError("Введите фамилию");
      return;
   }
   if (userData.type === UType.STUDENT && userData.group === null) {
      setError("Выберите группу");
      return;
   }
   if (userData.type === UType.TEACHER && userData.disciplines?.length === 0) {
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
         institutes: userData.institutes.map((institute) => institute.id),
         disciplines: userData.disciplines,
         type: UType.TEACHER,
      };
   }
   await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      .then(async () => {
         await addDoc(createCollection(DBQueries.USERS), {
            ...user,
         }).catch((e) => {
            setError(e.message);
         });
      })
      .catch((e) => {
         setError(e.message);
      });
};
