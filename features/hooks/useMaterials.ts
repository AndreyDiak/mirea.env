import { useCallback, useEffect, useMemo } from "react";

import { FirebaseError } from "firebase/app";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import type { FBMaterial, Material, UseCustomHook } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { MaterialConverter, QUERIES } from "../../utils";
import { deepCompare } from "../../utils/deepCompare";
import { selectMaterialsByDisciplineId, setMaterials } from "../slices/materialsSlice";

interface UseMaterials extends UseCustomHook {
   materials: Material[];
   error: FirebaseError;
}

export function useMaterials(disciplineId: string): UseMaterials {
   const dispatch = useDispatch();

   const rawMaterialsSelector = useCallback(
      (s: RootState) => selectMaterialsByDisciplineId(s, disciplineId),
      [disciplineId],
   );
   const rawMaterials = useSelector(rawMaterialsSelector);

   const q = QUERIES.CREATE_SIMPLE_QUERY<FBMaterial>(DB_PATHS.MATERIALS, {
      fieldName: "discipline_id",
      fieldValue: disciplineId,
      opStr: "==",
   });

   const [snapshot, loading, error] = useCollection(q);

   const loadMaterials = useCallback(() => {
      const materials =
         snapshot?.docs.map(
            (m) =>
               ({
                  ...m.data(),
                  id: m.id,
               } as FBMaterial),
         ) ?? [];
      // делаем глубокое сравнение двух объектов
      if (!deepCompare(materials, rawMaterials)) {
         dispatch(setMaterials({ materials, disciplineId }));
      }
   }, [disciplineId, dispatch, rawMaterials, snapshot?.docs]);

   useEffect(() => {
      // если у нас пусто или идет загрузка
      if (snapshot?.docs.length === 0 || loading) return;
      loadMaterials();
   }, [disciplineId, dispatch, loadMaterials, loading, snapshot]);

   return useMemo(() => {
      const newMaterials = rawMaterials ? MaterialConverter.toData(rawMaterials) : [];

      return {
         materials: newMaterials,
         loading,
         error,
      };
   }, [error, loading, rawMaterials]);
}
