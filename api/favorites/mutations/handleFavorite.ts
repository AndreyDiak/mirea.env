import { ToastAndroid } from "react-native";

import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import { db } from "../../../firebase";
import type { Favorite } from "../../../typings";
import { DB_PATHS } from "../../../typings/enums";
import { QUERIES } from "../../../utils/createDBQuery";

export const handleFavorite = async (userId: string, materialId: string, isInFavorite: boolean) => {
   if (!isInFavorite) {
      const data: Omit<Favorite, "id"> = {
         userId,
         materialId,
      };
      await addDoc(collection(db, DB_PATHS.FAVORITES), data);
      ToastAndroid.show("Добавлено в избранные", 1000);
   } else {
      const favorites = await getDocs(
         QUERIES.CREATE_MULTIPLE_QUERY<Favorite>(DB_PATHS.FAVORITES, [
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
         ]),
      );
      await deleteDoc(doc(db, `${DB_PATHS.FAVORITES}/${favorites.docs[0].id}`));
      ToastAndroid.show("Удалено из избранных", 1000);
   }
};
