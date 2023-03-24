import { useMemo } from "react";

import { useCollection } from "react-firebase-hooks/firestore";

import { FBComment } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { CommentConverter } from "../../utils/Converter/CommentConverter";
import { QUERIES } from "../../utils/createDBQuery";

export const useMaterialComments = (materialId: string) => {
   const q = QUERIES.CREATE_SIMPLE_QUERY_ORDERED<FBComment>(
      DB_PATHS.COMMENTS,
      {
         fieldName: "material_id",
         fieldValue: materialId,
         opStr: "==",
      },
      {
         fieldValue: "timestamp",
      },
   );
   const [snap, loading, error] = useCollection(q);

   const FBComments = useMemo(
      () =>
         snap?.docs.map(
            (comment) =>
               ({
                  ...comment.data(),
                  id: comment.id,
               } as FBComment),
         ) || [],
      [snap?.docs],
   );

   const comments = useMemo(() => CommentConverter.toData(FBComments), [FBComments]);

   return { comments, loading, error };
};
