import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";

export const getDisciplineById = async (id: string) => {
  const q = doc(db, "disciplines", `${id}`);

  const snap = await getDoc(q);
  if (snap.exists) {
    const data = {
      id: snap.id,
      ...snap.data(),
    } as Discipline;
    return data;
  } else {
    return null;
  }
};
