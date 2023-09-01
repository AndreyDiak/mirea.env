import { useEffect, useMemo, useState } from "react";

import { getDataById } from "../../api";
import { DB_PATHS, FBGroup, FBTeacher, Lesson, PreviewLesson, USER_TYPE, UseCustomHook } from "../../typings";
import { isEmpty, localeSort } from "../../utils";

interface UsePreviewLesson extends UseCustomHook {
   previewLessons: PreviewLesson[];
}

export function usePreviewLessons(lessons: Lesson[], userType: USER_TYPE): UsePreviewLesson {
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
                  groupNames: [],
               };

               if (userType === USER_TYPE.STUDENT) {
                  if (!isEmpty(lesson.teachersIds)) {
                     previewLesson.teachersNames = await Promise.all(
                        lesson?.teachersIds.map(async (teacherId) => {
                           const teacher = await getDataById<FBTeacher>(teacherId, DB_PATHS.USERS);

                           return !isEmpty(teacher) ? `${teacher.female} ${teacher.name[0]}.` : null;
                        }),
                     ).then((res) => res.filter(Boolean).sort(localeSort));
                  }
               } else if (userType === USER_TYPE.TEACHER) {
                  if (!isEmpty(lesson.groupsIds)) {
                     previewLesson.groupNames = await Promise.all(
                        lesson?.groupsIds.map(async (groupId) => {
                           const group = await getDataById<FBGroup>(groupId, DB_PATHS.GROUPS);
                           return group.name;
                        }),
                     ).then((res) => res.filter(Boolean).sort(localeSort));
                  }
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
   }, [lessons, userType]);

   return useMemo(
      () => ({
         loading,
         previewLessons,
      }),
      [loading, previewLessons],
   );
}
