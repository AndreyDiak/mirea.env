import { ToastAndroid } from "react-native";

import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import { db } from "../../../firebase";
import type { FBFavorite } from "../../../typings";
import { DB_PATHS } from "../../../typings/enums";
import { QUERIES } from "../../../utils/createDBQuery";

export const handleFavorite = async (userId: string, materialId: string, isInFavorite: boolean) => {
   if (!isInFavorite) {
      const data: Omit<FBFavorite, "id"> = {
         user_id: userId,
         material_id: materialId,
      };
      await addDoc(collection(db, DB_PATHS.FAVORITES), data);
      ToastAndroid.show("Добавлено в избранные", 1000);
   } else {
      const favorites = await getDocs(
         QUERIES.CREATE_MULTIPLE_QUERY<FBFavorite>(DB_PATHS.FAVORITES, [
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
         ]),
      );
      await deleteDoc(doc(db, `${DB_PATHS.FAVORITES}/${favorites.docs[0].id}`));
      ToastAndroid.show("Удалено из избранных", 1000);
   }
};
