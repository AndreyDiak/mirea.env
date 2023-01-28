import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { DBQueries } from "../../../typings/enums";

export const getGroupById = async (id: string) => {
  const q = doc(db, DBQueries.GROUPS, `${id}`);

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
