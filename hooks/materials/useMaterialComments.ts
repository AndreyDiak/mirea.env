import { useMemo } from "react";

import { orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { FBComment } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { CommentConverter } from "../../utils";
import { createCollection } from "../../utils/createDBQuery";

export const useMaterialComments = (materialId: string) => {
   const q = query(createCollection(`${DB_PATHS.MATERIALS}/${materialId}/comments`), orderBy("timestamp"));

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
