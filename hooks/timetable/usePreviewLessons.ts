import { useEffect, useMemo, useState } from "react";

import { useSelector } from "react-redux";

import { getDataById } from "../../api";
import { selectUserType } from "../../features/userSlice";
import { DB_PATHS, FBGroup, FBTeacher, Lesson, PreviewLesson, USER_TYPE } from "../../typings";
import { isEmpty } from "../../utils";

interface UsePreviewLesson {
   previewLessons: PreviewLesson[];
   loading: boolean;
}

export function usePreviewLessons(lessons: Lesson[]): UsePreviewLesson {
   const [previewLessons, setPreviewLessons] = useState<PreviewLesson[]>(null);
   const [loading, setLoading] = useState(false);

   const userType = useSelector(selectUserType);

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
                     const teachersNames = await Promise.all(
                        lesson?.teachersIds
                           .map(async (teacherId) => {
                              const teacher = await getDataById<FBTeacher>(teacherId, DB_PATHS.USERS);
                              return `${teacher.female} ${teacher.name[0]}.`;
                           })
                           .filter(Boolean),
                     );
                     previewLesson.teachersNames = teachersNames
                        .filter(Boolean)
                        .sort((prev, next) => prev.localeCompare(next));
                  }
               } else if (userType === USER_TYPE.TEACHER) {
                  if (!isEmpty(lesson.groupsIds)) {
                     const groupsName = await Promise.all(
                        lesson?.groupsIds.map(async (groupId) => {
                           const group = await getDataById<FBGroup>(groupId, DB_PATHS.GROUPS);
                           return group.name;
                        }),
                     );
                     previewLesson.groupNames = groupsName
                        .filter(Boolean)
                        .sort((prev, next) => prev.localeCompare(next));
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