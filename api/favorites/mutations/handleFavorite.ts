import { ToastAndroid } from "react-native";
import {
  addDoc,
  collection,
  getDocs,
  where,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";

export const handleFavorite = async (
  userId: string,
  materialId: string,
  isInFavorite: boolean
) => {
  if (!isInFavorite) {
    await addDoc(collection(db, `users/${userId}/favorites`), {
      materialId: materialId,
    });
    ToastAndroid.show("Добавлено в избранные", 1000);
  } else {
    const favorites = await getDocs(
      query(
        collection(db, `users/${userId}/favorites`),
        where("materialId", "==", materialId)
      )
    );
    await deleteDoc(
      doc(db, `users/${userId}/favorites/${favorites.docs[0].id}`)
    );
    ToastAndroid.show("Удалено из избранных", 1000);
  }
};
