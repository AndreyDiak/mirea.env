import { getDocs, query } from "firebase/firestore";

import { DB_PATHS } from "../../typings/enums";
import { createCollection } from "../../utils";

export const getAllData = async <T>(collectionName: DB_PATHS): Promise<T[]> => {
   const q = query(createCollection(collectionName));
   const snap = await getDocs(q);

   if (!snap.empty) {
      const data = snap.docs.map(
         (doc) =>
            ({
               id: doc.id,
               ...doc.data(),
            } as T),
      );
      return data;
   }

   return [];
};
