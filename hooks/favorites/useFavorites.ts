import { useCallback, useEffect, useMemo, useState } from "react";

import { FirebaseError } from "firebase/app";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";

import { getDataById } from "../../api";
import { selectFavorites, setFavorites } from "../../features/slices/favoritesSlice";
import { selectUser } from "../../features/slices/userSlice";
import { RootState } from "../../store";
import type { Discipline, FBFavorite, FBMaterial, PreviewFavorite } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { MaterialConverter } from "../../utils/Converter/MaterialConverter";
import { QUERIES } from "../../utils/createDBQuery";
import { deepCompare } from "../../utils/deepCompare";
import { isEmpty } from "../../utils/isEmpty";

interface UseFavorites {
   favorites: PreviewFavorite[];
   loading: boolean;
   error: FirebaseError;
}

export function useFavorites(): UseFavorites {
   const dispatch = useDispatch();

   const rawFavoritesSelector = useCallback((s: RootState) => selectFavorites(s), []);
   const rawFavorites = useSelector(rawFavoritesSelector);

   const [previewFavorites, setPreviewFavorites] = useState<PreviewFavorite[]>([]);

   const user = useSelector(selectUser);

   const q = QUERIES.CREATE_SIMPLE_QUERY<FBFavorite>(DB_PATHS.FAVORITES, {
      fieldName: "user_id",
      fieldValue: user.id,
      opStr: "==",
   });

   const [snapshot, loading, error] = useCollection(q);

   const loadFavorites = useCallback(async () => {
      const favorites: FBMaterial[] = await Promise.all(
         snapshot?.docs.map(async (doc) => {
            const materialId = doc.data().material_id;
            const material = await getDataById<FBMaterial>(materialId, DB_PATHS.MATERIALS);
            return material;
         }),
      );

      if (!deepCompare(favorites, rawFavorites)) {
         dispatch(setFavorites({ favorites }));
      }
   }, [dispatch, rawFavorites, snapshot?.docs]);

   const loadPreviewFavorites = useCallback(async () => {
      const rawPreviewFavorites: PreviewFavorite[] = await Promise.all(
         rawFavorites.filter(Boolean).map(async (favorite) => {
            const discipline = await getDataById<Discipline>(favorite.discipline_id, DB_PATHS.DISCIPLINES);
            return {
               disciplineName: discipline.name,
               material: MaterialConverter.convertMaterialFromApi(favorite),
            };
         }),
      );

      setPreviewFavorites(rawPreviewFavorites);
   }, [rawFavorites]);

   useEffect(() => {
      if (snapshot?.docs.length === 0 || loading) return;
      // загруажем сырые FBMaterial
      loadFavorites();
   }, [loadFavorites, loading, snapshot?.docs]);

   useEffect(() => {
      if (!isEmpty(rawFavorites)) {
         loadPreviewFavorites();
      }
   }, [loadPreviewFavorites, rawFavorites]);

   return useMemo(() => {
      return {
         favorites: previewFavorites,
         loading,
         error,
      };
   }, [error, loading, previewFavorites]);
}
