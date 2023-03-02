import { useCollection } from "react-firebase-hooks/firestore";

import { DBComment } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { QUERIES } from "../../utils/createDBQuery";

export const useMaterialComments = (materialId: string) => {
   const q = QUERIES.CREATE_SIMPLE_QUERY_ORDERED<DBComment>(
      DB_PATHS.COMMENTS,
      {
         fieldName: "materialId",
         fieldValue: materialId,
         opStr: "==",
      },
      {
         fieldValue: "timestamp",
      },
   );
   const [snap, loading, error] = useCollection(q);

   const comments =
      snap?.docs.map(
         (comment) =>
            ({
               ...comment.data(),
               id: comment.id,
            } as DBComment),
      ) || [];
   return { comments, loading, error };
};