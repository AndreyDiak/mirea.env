import { collection, getDocs, query } from "firebase/firestore";

import { db } from "../../firebase";
import { DBQueries } from "../../typings/enums";

export const getAllData = async <T>(collectionName: DBQueries): Promise<T[]> => {
   const q = query(collection(db, collectionName));
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
};
