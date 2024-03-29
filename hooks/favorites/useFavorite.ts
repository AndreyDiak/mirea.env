import { useCollection } from "react-firebase-hooks/firestore";

import { FBFavorite } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { QUERIES } from "../../utils/createDBQuery";

export const useFavorite = (userId: string, materialId: string) => {
   const q = QUERIES.CREATE_MULTIPLE_QUERY<FBFavorite>(DB_PATHS.FAVORITES, [
      {
         fieldName: "user_id",
         fieldValue: userId,
         opStr: "==",
      },
      {
         fieldName: "material_id",
         fieldValue: materialId,
         opStr: "==",
      },
   ]);
   const [snap, loading] = useCollection(q);

   return !loading && !snap?.empty;
};
