import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { DBQueries } from "../../typings/enums";

export const getDataById = async <T>(id: string, collectionName: DBQueries): Promise<T> => {
  const q = doc(db, collectionName, `${id}`);

  const snap = await getDoc(q);
  if (snap.exists) {
    const data = {
      id: snap.id,
      ...snap.data(),
    } as T;
    return data;
  } else {
    return null;
  }
};
