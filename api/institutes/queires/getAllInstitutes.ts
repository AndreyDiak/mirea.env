import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";

export const getAllInstitutes = async <T>(): Promise<T[]> => {
  const q = query(collection(db, "institutes"));
  const snap = await getDocs(q);

  if (!snap.empty) {
    const data = snap.docs.map(
      (institute) =>
        ({
          id: institute.id,
          ...institute.data(),
        } as T)
    );
    return data;
  }
};
