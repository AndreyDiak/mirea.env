import { DocumentData, Query, getDocs } from "firebase/firestore";

export const getAllDataWithFilter = async <T>(q: Query<DocumentData>): Promise<T[]> => {
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
