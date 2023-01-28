import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { DBQueries } from "../../typings/enums";

export const getAllDataWithFilter = async <T>(
  collectionName: DBQueries,
  fieldName: string,
  fieldValue: string
): Promise<T[]> => {
  const q = query(
    collection(db, collectionName),
    where(fieldName, "==", fieldValue)
  );
  const snap = await getDocs(q);

  if (!snap.empty) {
    const data = snap.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as T)
    );
    return data;
  }
  return [];
};
