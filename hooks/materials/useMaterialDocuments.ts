import { useMemo } from "react";

import { useCollection } from "react-firebase-hooks/firestore";

import type { FBSource } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { MaterialConverter, QUERIES } from "../../utils";

export const useMaterialDocuments = (materialId: string) => {
   const q = QUERIES.CREATE_SIMPLE_QUERY<FBSource>(DB_PATHS.SOURCES, {
      fieldName: "material_id",
      fieldValue: materialId,
      opStr: "==",
   });
   const [snap, loading, error] = useCollection(q);

   const FBsources = useMemo(
      () =>
         snap?.docs.map(
            (comment) =>
               ({
                  ...comment.data(),
                  id: comment.id,
               } as FBSource),
         ) || [],
      [snap?.docs],
   );

   const sources = useMemo(
      () => FBsources.map((source) => MaterialConverter.convertSourceFromApi(source)),
      [FBsources],
   );

   return {
      sources,
      loading,
      error,
   };
};
