import { useCollection } from "react-firebase-hooks/firestore";

import type { Source } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { QUERIES } from "../../utils/createDBQuery";

export const useMaterialDocuments = (materialId: string) => {
   const q = QUERIES.CREATE_SIMPLE_QUERY<Source>(DB_PATHS.SOURCES, {
      fieldName: "materialId",
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
            } as Source),
      ) || [];
   return { sources, loading, error };
};
