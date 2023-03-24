import { deleteDoc } from "firebase/firestore";

import { DB_PATHS } from "../../../typings";
import { DOCS } from "../../../utils";

// delete material if u an owner

export const deleteMaterial = async (materialId: string) => {
   await deleteDoc(DOCS.CREATE_DOC(DB_PATHS.MATERIALS, materialId));
};
