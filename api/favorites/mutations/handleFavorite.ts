import { ToastAndroid } from "react-native";

import { addDoc, collection, deleteDoc, doc, getDocs } from "firebase/firestore";

import { db } from "../../../firebase";
import type { Favorite } from "../../../typings";
import { DBQueries } from "../../../typings/enums";
import { QUERIES } from "../../../utils/createDBQuery";

export const handleFavorite = async (id: string, materialId: string, isInFavorite: boolean) => {
   if (!isInFavorite) {
      const data: Omit<Favorite, "id"> = {
         id,
         materialId,
      };
      await addDoc(collection(db, DBQueries.FAVORITES), data);
      ToastAndroid.show("Добавлено в избранные", 1000);
   } else {
      const favorites = await getDocs(
         QUERIES.CREATE_MULTIPLE_QUERY<Favorite>(DBQueries.FAVORITES, [
            {
               fieldName: "id",
               fieldValue: id,
               opStr: "==",
            },
            {
               fieldName: "materialId",
               fieldValue: materialId,
               opStr: "==",
            },
         ]),
      );
      await deleteDoc(doc(db, `${DBQueries.FAVORITES}/${favorites.docs[0].id}`));
      ToastAndroid.show("Удалено из избранных", 1000);
   }
};
