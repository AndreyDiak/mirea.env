import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../../firebase";

export const getAllGroups = async () => {
  const q = query(collection(db, "groups"));
  const snap = await getDocs(q);

  if (!snap.empty) {
    // добавить сюда подгрузку залинкованных дисциплин
    const data = snap.docs.map(
      (group) =>
        ({
          id: group.id,
          ...group.data(),
        } as Group)
    );

    return data;
  }
};
