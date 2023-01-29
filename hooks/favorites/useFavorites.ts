import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { getMaterialById } from "../../api";
import { getDataById } from "../../api/queries/getDataById";
import { getUser } from "../../features/userSlice";
import { DBQueries } from "../../typings/enums";
import { QUERIES } from "../../utils/createDBQuery";

// TODO переделать по типу useMaterials

interface FavoriteItem {
  fId: string; // current favorite item id
  mId: string; // id of material
}

export const useFavorites = () => {
  const user = useSelector(getUser);
  // const [loading, setLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Favorites[]>([]);
  // const q = query(collection(db, `users/${user.userId}/favorites`));

  const q = QUERIES.CREATE_SIMPLE_QUERY<Favorite>(DBQueries.FAVORITES, {
    fieldName: "userId",
    fieldValue: user.userId,
    opStr: "==",
  });

  const [snapshot, loading, error] = useCollection(q);

  useEffect(() => {
    const getData = async () => {
      await Promise.all(
        snapshot?.docs.map(async (doc) => {
          const material = await getMaterialById(doc.data().materialId);
          const discipline = await getDataById<Discipline>(
            material.disciplineId,
            DBQueries.DISCIPLINES
          );
          return {
            disciplineName: discipline.name,
            material,
          };
        }) || []
      )
        .then((data) => {
          setFavorites(data || []);
        })
        .catch((e) => {
          console.log(e);
        });
    };
    getData();
  }, [snapshot]);

  // });

  return {
    favorites,
    loading: loading || (snapshot.docs.length > 0 && favorites.length === 0),
    error,
  };
};
