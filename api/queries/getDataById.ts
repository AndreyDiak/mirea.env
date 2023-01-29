import { getDoc } from "firebase/firestore";
import { DBQueries } from "../../typings/enums";
import { createDoc } from "../../utils/createDBQuery";

export const getDataById = async <T>(id: string, collectionName: DBQueries): Promise<T> => {
  const q = createDoc(collectionName, id);
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
