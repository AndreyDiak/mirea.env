import { useEffect, useMemo, useState } from "react";

import { FirebaseError } from "firebase/app";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";

import { getDataById } from "../../api";
import { selectUser } from "../../features/userSlice";
import type { Discipline, FBFavorite, FBMaterial, PreviewFavorite } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { MaterialConverter } from "../../utils/Converter/MaterialConverter";
import { QUERIES } from "../../utils/createDBQuery";
import { isEmpty } from "../../utils/isEmpty";

interface UseFavorites {
   favorites: PreviewFavorite[];
   loading: boolean;
   error: FirebaseError;
}

export function useFavorites(): UseFavorites {
   const user = useSelector(selectUser);

   const [favorites, setFavorites] = useState<PreviewFavorite[]>([]);

   const q = QUERIES.CREATE_SIMPLE_QUERY<FBFavorite>(DB_PATHS.FAVORITES, {
      fieldName: "user_id",
      fieldValue: user.id,
      opStr: "==",
   });

   const [snapshot, loading, error] = useCollection(q);

   useEffect(() => {
      const getData = async () => {
         await Promise.all(
            snapshot?.docs.map(async (doc) => {
               // const material = await getMaterialById(doc.data().materialId);
               const material = await getDataById<FBMaterial>(doc.data().material_id, DB_PATHS.MATERIALS);
               if (material) {
                  const discipline = await getDataById<Discipline>(
                     material.discipline_id,
                     DB_PATHS.DISCIPLINES,
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
            setFavorites(
               data.filter(Boolean).map((item) => ({
                  disciplineName: item.disciplineName,
                  material: MaterialConverter.toData(item.material),
               })) || [],
            );
         });
      };
      getData();
   }, [snapshot]);

   return useMemo(() => {
      return {
         favorites,
         loading: loading || (!isEmpty(snapshot.docs) && isEmpty(favorites)),
         error,
      };
   }, [error, favorites, loading, snapshot.docs]);
}
