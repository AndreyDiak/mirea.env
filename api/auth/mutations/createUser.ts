import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../../firebase";

interface Props {
  data: NewUser;
  isStudent: boolean;
  group: Group;
  disciplines: string[];
  institutes: string[];
  setError: (error: string) => void;
}

export const createUser = async ({
  data,
  isStudent,
  group,
  disciplines,
  setError,
  institutes,
}: Props) => {
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

  let user: SuperUser;

  if (isStudent) {
    user = {
      ...(data as User),
      groupId: group.id,
      instituteId: institutes[0],
      type: "student",
    };
  } else {
    user = {
      ...(data as User),
      disciplines,
      institutes,
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
