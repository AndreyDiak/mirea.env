import { useCallback, useEffect, useMemo } from "react";

import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import type { FBSource } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { MaterialConverter, QUERIES } from "../../utils";
import { deepCompare } from "../../utils/deepCompare";
import { selectDocumentsByMaterialId, setDocuments } from "../slices/documentsSlice";

export const useDocuments = (materialId: string) => {
   const dispatch = useDispatch();

   const rawDocumentsSelector = useCallback(
      (s: RootState) => selectDocumentsByMaterialId(s, materialId),
      [materialId],
   );
   const rawDocuments = useSelector(rawDocumentsSelector);

   const q = QUERIES.CREATE_SIMPLE_QUERY<FBSource>(DB_PATHS.SOURCES, {
      fieldName: "material_id",
      fieldValue: materialId,
      opStr: "==",
   });
   const [snap, loading, error] = useCollection(q);

   const loadDocuments = useCallback(() => {
      const documents =
         snap?.docs.map(
            (comment) =>
               ({
                  ...comment.data(),
                  id: comment.id,
               } as FBSource),
         ) || [];
      if (!deepCompare(documents, rawDocuments)) {
         dispatch(setDocuments({ documents, materialId }));
      }
   }, [dispatch, materialId, rawDocuments, snap?.docs]);

   useEffect(() => {
      if (snap?.docs.length === 0 || loading) return;
      loadDocuments();
   });

   return useMemo(() => {
      const sources = rawDocuments
         ? rawDocuments.map((doc) => ({ ...MaterialConverter.convertSourceFromApi(doc) }))
         : [];

      return {
         sources,
         loading,
         error,
      };
   }, [error, loading, rawDocuments]);
};
