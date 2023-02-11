import { useEffect, useState } from "react";

import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";

import { getDataById, getMaterialById } from "../../api";
import { selectUser } from "../../features/userSlice";
import type { Discipline, Favorite, Favorites } from "../../typings";
import { DBQueries } from "../../typings/enums";
import { QUERIES } from "../../utils/createDBQuery";

export const useFavorites = () => {
   const user = useSelector(selectUser);

   const [favorites, setFavorites] = useState<Favorites[]>([]);

   const q = QUERIES.CREATE_SIMPLE_QUERY<Favorite>(DBQueries.FAVORITES, {
      fieldName: "id",
      fieldValue: user.id,
      opStr: "==",
   });

   const [snapshot, loading, error] = useCollection(q);

   useEffect(() => {
      const getData = async () => {
         await Promise.all(
            snapshot?.docs.map(async (doc) => {
               const material = await getMaterialById(doc.data().materialId);
               if (material) {
                  const discipline = await getDataById<Discipline>(
                     material.disciplineId,
                     DBQueries.DISCIPLINES,
                  );
                  return {
                     disciplineName: discipline?.name,
                     material,
                  };
               }
               return null;
            }) || [],
         ).then((data) => {
            // проверка на то, что если материал, который был добавлен в favorites был удален
            setFavorites(data.filter((item) => item !== null) || []);
         });
      };
      getData();
   }, [snapshot]);

   return {
      favorites,
      loading: loading || (snapshot.docs.length > 0 && favorites.length === 0),
      error,
   };
};
