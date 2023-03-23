import { useCollection } from "react-firebase-hooks/firestore";

import type { FBMaterial, Material } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { QUERIES } from "../../utils";

export const useMaterials = (disciplineId: string) => {
   const q = QUERIES.CREATE_SIMPLE_QUERY_ORDERED<FBMaterial>(
      DB_PATHS.MATERIALS,
      {
         fieldName: "discipline_id",
         fieldValue: disciplineId,
         opStr: "==",
      },
      {
         fieldValue: "timestamp",
      },
   );
   const [snapshot, loading, error] = useCollection(q);

   const materials = snapshot?.docs.map(
      (m) =>
         ({
            id: m.id,
            ...m.data(),
         } as Material),
   );

   return { materials, loading, error };
};
