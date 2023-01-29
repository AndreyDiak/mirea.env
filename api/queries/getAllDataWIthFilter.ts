import { getDocs } from "firebase/firestore";
import { DBQueries } from "../../typings/enums";
import { QUERIES } from "./../../utils/createDBQuery";

export const getAllDataWithFilter = async <T>(
  collectionName: DBQueries,
  fieldName: keyof T,
  fieldValue: T[keyof T]
): Promise<T[]> => {
  const q = QUERIES.CREATE_SIMPLE_QUERY(collectionName, {
    fieldName,
    fieldValue,
    opStr: "==",
  });

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
