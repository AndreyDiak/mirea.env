import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";

export const getAllDisciplines = async () => {
  const q = query(collection(db, "disciplines"));
  const snap = await getDocs(q);

  if (!snap.empty) {
    const data = snap.docs.map(
      (discipline) =>
        ({
          id: discipline.id,
          ...discipline.data(),
        } as Discipline)
    );

    return data;
  }
};
