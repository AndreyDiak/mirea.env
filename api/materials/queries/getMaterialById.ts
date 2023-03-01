import { collection, getDoc, getDocs, query } from "firebase/firestore";

import { db } from "../../../firebase";
import { DB_PATHS } from "../../../typings/enums";
import { DOCS } from "../../../utils/createDBQuery";

export const getMaterialById = async (mId: string) => {
   const q = DOCS.CREATE_DOC(DB_PATHS.MATERIALS, mId);

   const snap = await getDoc(q);
   if (snap.exists()) {
      // material documents
      const docQ = query(collection(db, `materials/${mId}/sources`));
      const docSnap = await getDocs(docQ);

      const data = {
         ...snap.data(),
         documents: docSnap.docs.map(
            (doc) =>
               ({
                  ...doc.data(),
                  id: doc.id,
               } as Source),
         ),
         comments: [],
         // comments: commentsSnap.docs.map(
         //   (comment) =>
         //     ({
         //       ...comment.data(),
         //       id: comment.id,
         //     } as Comment)
         // ),
         id: snap.id,
      } as Material;

      return data;
   }
   return null;
};
