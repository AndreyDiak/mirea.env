import { useMemo } from "react";

import { useCollection } from "react-firebase-hooks/firestore";

import type { FBMaterial } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { MaterialConverter, QUERIES } from "../../utils";

export const useMaterials = (disciplineId: string) => {
   const q = QUERIES.CREATE_SIMPLE_QUERY<FBMaterial>(DB_PATHS.MATERIALS, {
      fieldName: "discipline_id",
      fieldValue: disciplineId,
      opStr: "==",
   });
   const [snapshot, loading, error] = useCollection(q);

   const FBmaterials = useMemo(
      () =>
         snapshot?.docs.map(
            (m) =>
               ({
                  id: m.id,
                  ...m.data(),
               } as FBMaterial),
         ) ?? [],
      [snapshot?.docs],
   );

   const materials = useMemo(
      () => FBmaterials.map((material) => MaterialConverter.toData(material)),
      [FBmaterials],
   );

   return { materials, loading, error };
};
