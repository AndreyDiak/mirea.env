import { collection, onSnapshot, query } from "firebase/firestore";
import { useState } from "react";
import { useSelector } from "react-redux";
import { getMaterialById } from "../../api";
import { getDataById } from "../../api/queries/getDataById";
import { getUser } from "../../features/userSlice";
import { db } from "../../firebase";
import { DBQueries } from "../../typings/enums";

// TODO переделать по типу useMaterials

interface FavoriteItem {
  fId: string; // current favorite item id
  mId: string; // id of material
}

export const useFavorites = () => {
  const user = useSelector(getUser);
  // const [loading, setLoading] = useState<boolean>(false);
  const [initialFavorites, setInitialFavorites] = useState<Favorites[]>([]);

  const q = query(collection(db, `users/${user.userId}/favorites`));

  onSnapshot(q, async (snap) => {
    // получение всех materialId которые хранятся у пользователя
    const favoritesIdsList: FavoriteItem[] = snap.docs.map((favorite) => ({
      fId: favorite.id,
      mId: favorite.data().materialId,
    }));

    const favorites: Favorites[] = [];

    await Promise.all(
      favoritesIdsList.map(async (favorite) => {
        // get material by ID
        const material = await getMaterialById(favorite.mId);
        // get discipline by ID
        // const discipline = await getDisciplineById(material.disciplineId);
        const discipline = await getDataById<Discipline>(
          material.disciplineId,
          DBQueries.DISCIPLINES
        );

        favorites.push({
          disciplineName: discipline.name,
          material,
        });
      })
    );
    if (favorites.length !== initialFavorites.length) {
      setInitialFavorites(favorites);
    }
  });

  return { initialFavorites };
};
