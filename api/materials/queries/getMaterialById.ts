import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";

export const getMaterialById = async (mId: string) => {
  const q = doc(db, "materials", `${mId}`);

  const snap = await getDoc(q);
  if (snap.exists) {
    // material documents
    const docQ = query(collection(db, `materials/${mId}/sources`));
    const docSnap = await getDocs(docQ);
    // material comments
    const commentsQuery = query(
      collection(db, "comments"),
      where("materialId", "==", mId),
      orderBy("timestamp")
    );
    const commentsSnap = await getDocs(commentsQuery);

    const data = {
      ...snap.data(),
      documents: docSnap.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            id: doc.id,
          } as Source)
      ),
      comments: commentsSnap.docs.map(
        (comment) =>
          ({
            ...comment.data(),
            id: comment.id,
          } as Comment)
      ),
      id: snap.id,
    } as Material;

    return data;
  } else {
    return null;
  }
};
