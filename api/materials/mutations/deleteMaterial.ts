import { deleteDoc, doc } from "firebase/firestore";

import { db } from "../../../firebase";

// delete material if u an owner

export const deleteMaterial = async (materialId: string) => {
   await deleteDoc(doc(db, `materials/${materialId}`));
};
