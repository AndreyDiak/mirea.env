import { useCollection } from "react-firebase-hooks/firestore";

import type { FBSource } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { MaterialConverter } from "../../utils/Converter/MaterialConverter";
import { QUERIES } from "../../utils/createDBQuery";

export const useMaterialDocuments = (materialId: string) => {
   const q = QUERIES.CREATE_SIMPLE_QUERY<FBSource>(DB_PATHS.SOURCES, {
      fieldName: "material_id",
      fieldValue: materialId,
      opStr: "==",
   });
   const [snap, loading, error] = useCollection(q);

   const sources =
      snap?.docs.map(
         (comment) =>
            ({
               ...comment.data(),
               id: comment.id,
            } as FBSource),
      ) || [];

   return {
      sources: sources.map((source) => MaterialConverter.convertSourceFromApi(source)),
      loading,
      error,
   };
};
