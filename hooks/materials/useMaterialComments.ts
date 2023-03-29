import { useCallback, useEffect, useMemo } from "react";

import { FirebaseError } from "firebase/app";
import { orderBy, query } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useDispatch, useSelector } from "react-redux";

import { selectCommentsByDisciplineId, setComments } from "../../features/slices/commentsSlice";
import { RootState } from "../../store";
import { Comment, FBComment } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { CommentConverter } from "../../utils";
import { createCollection } from "../../utils/createDBQuery";
import { deepCompare } from "../../utils/deepCompare";

interface UseMaterialComments {
   comments: Comment[];
   loading: boolean;
   error: FirebaseError;
}

export function useMaterialComments(materialId: string): UseMaterialComments {
   const dispatch = useDispatch();
   const rawCommentsSelector = useCallback(
      (s: RootState) => selectCommentsByDisciplineId(s, materialId),
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
      const newComments = rawComments ? CommentConverter.toData(rawComments) : [];

      return {
         comments: newComments,
         loading,
         error,
      };
   }, [error, loading, rawComments]);
}
