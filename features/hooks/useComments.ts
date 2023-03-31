import { useCallback, useEffect, useMemo } from "react";

import { FirebaseError } from "firebase/app";
import { orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import { Comment, FBComment } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { CommentConverter } from "../../utils";
import { createCollection } from "../../utils/createDBQuery";
import { deepCompare } from "../../utils/deepCompare";
import { selectCommentsByMaterialId, setComments } from "../slices/commentsSlice";

interface UseComments {
   comments: Comment[];
   loading: boolean;
   error: FirebaseError;
}

export function useComments(materialId: string): UseComments {
   const dispatch = useDispatch();
   const rawCommentsSelector = useCallback(
      (s: RootState) => selectCommentsByMaterialId(s, materialId),
      [materialId],
   );
   const rawComments = useSelector(rawCommentsSelector);

   const q = query(createCollection(`${DB_PATHS.MATERIALS}/${materialId}/comments`), orderBy("timestamp"));

   const [snap, loading, error] = useCollection(q);

   const loadMaterials = useCallback(() => {
      const comments =
         snap?.docs.map(
            (comment) =>
               ({
                  ...comment.data(),
                  id: comment.id,
               } as FBComment),
         ) || [];

      // делаем глубокое сравнение двух объектов
      if (!deepCompare(comments, rawComments)) {
         dispatch(setComments({ comments, materialId }));
      }
   }, [dispatch, materialId, rawComments, snap?.docs]);

   useEffect(() => {
      // если у нас пусто или идет загрузка
      if (snap?.docs.length === 0 || loading) return;
      loadMaterials();
   }, [dispatch, loadMaterials, loading, snap]);

   return useMemo(() => {
      const comments = rawComments ? CommentConverter.toData(rawComments) : [];

      return {
         comments,
         loading,
         error,
      };
   }, [error, loading, rawComments]);
}
