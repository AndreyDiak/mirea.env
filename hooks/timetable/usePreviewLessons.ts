import { useEffect, useMemo, useState } from "react";

import { getDataById } from "../../api";
import { DB_PATHS, FBTeacher, Lesson, PreviewLesson } from "../../typings";
import { isEmpty } from "../../utils/isEmpty";

interface UsePreviewLesson {
   previewLessons: PreviewLesson[];
   loading: boolean;
}

export function usePreviewLessons(lessons: Lesson[]): UsePreviewLesson {
   const [previewLessons, setPreviewLessons] = useState<PreviewLesson[]>(null);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      let active = true;

      const getData = async () => {
         setLoading(true);

         const newPreviewLessons: PreviewLesson[] = await Promise.all(
            lessons.map(async (lesson) => {
               const previewLesson: PreviewLesson = {
                  name: lesson.name,
                  cabinet: lesson.cabinet,
                  teachersNames: [],
               };

               if (!isEmpty(lesson.teachersIds)) {
                  const teachersNames = await Promise.all(
                     lesson.teachersIds.map(async (teacherId) => {
                        const teacher = await getDataById<FBTeacher>(teacherId, DB_PATHS.USERS);
                        return `${teacher.female} ${teacher.name[0]}.`;
                     }),
                  );
                  previewLesson.teachersNames = teachersNames;
               }

               return previewLesson;
            }),
         );
         if (!active) return;

         setPreviewLessons(newPreviewLessons);

         setLoading(false);
      };

      getData();

      return () => {
         active = false;
      };
   }, [lessons]);

   return useMemo(
      () => ({
         loading,
         previewLessons,
      }),
      [loading, previewLessons],
   );
}
