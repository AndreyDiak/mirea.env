import { useCollection } from "react-firebase-hooks/firestore";

import { DBQueries } from "../../typings/enums";
import { QUERIES } from "../../utils/createDBQuery";

export const useFavorite = (userId: string, materialId: string) => {
   const q = QUERIES.CREATE_MULTIPLE_QUERY(DBQueries.FAVORITES, [
      {
         fieldName: "userId",
         fieldValue: userId,
         opStr: "==",
      },
      {
         fieldName: "materialId",
         fieldValue: materialId,
         opStr: "==",
      },
   ]);
   const [snap, loading] = useCollection(q);

   return !loading && !snap?.empty;
};
