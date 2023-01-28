import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../../firebase";

interface Props {
  data: NewUser;
  isStudent: boolean;
  group: Group;
  disciplines: string[];
  setError: (error: string) => void;
}

export const createUser = async ({ data, isStudent, group, disciplines, setError }: Props) => {
  if (data.name === "") {
    setError("Введите имя");
    return;
  }
  if (data.female === "") {
    setError("Введите фамилию");
    return;
  }
  if (isStudent && group === null) {
    setError("Выберите группу");
    return;
  }
  if (!isStudent && disciplines.length === 0) {
    setError("Выберите дисциплины");
    return;
  }

  let user: NewSuperUser;

  if (isStudent) {
    user = {
      ...data,
      groupId: group.id,
      type: "student",
    };
  } else {
    user = {
      ...data,
      disciplines,
      type: "teacher",
    };
  }
  await createUserWithEmailAndPassword(auth, data.email, data.password)
    .then(async () => {
      await addDoc(collection(db, "users"), {
        ...user,
      }).catch((e) => {
        console.log(e.message);
        setError(e.message);
      });
    })
    .catch((e) => {
      console.log(e.message);
      setError(e.message);
    });
  return null;
};
