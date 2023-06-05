import { useCallback, useEffect, useMemo, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { getAllDataWithFilter } from "../../api/queries/getAllDataWIthFilter";
import {
   selectLessonsForStudent,
   selectLessonsForTeacher,
   setLessons,
} from "../../features/slices/timetableSlice";
import { RootState } from "../../store";
import { AppUser, FBLesson, Student, Timetable } from "../../typings";
import { DB_PATHS, USER_TYPE } from "../../typings/enums";
import { QUERIES, TimetableConverter } from "../../utils";
import { deepCompare } from "../../utils/deepCompare";

interface UseTimetable {
   timetable: Timetable;
   loading: boolean;
   dayIndex: number;
   setDayIndex(dayIndex: number): void;
}

export function useTimetable(user: AppUser): UseTimetable {
   const dispatch = useDispatch();
   // const user = useSelector(selectUser);

   const [loading, setLoading] = useState<boolean>(false);
   const [dayIndex, setDayIndex] = useState(0);

   const rawStudentLessonsSelector = useCallback(
      (s: RootState) => selectLessonsForStudent(s, (user as Student).groupId ?? ""),
      [user],
   );

   const rawTeacherLessonsSelector = useCallback(
      (s: RootState) => selectLessonsForTeacher(s, user.id),
      [user.id],
   );

   const rawStudentLessons = useSelector(rawStudentLessonsSelector);
   const rawTeacherLessons = useSelector(rawTeacherLessonsSelector);

   const loadStudentTimetable = useCallback(
      async (groupId: string) => {
         const q = QUERIES.CREATE_SIMPLE_QUERY<FBLesson>(DB_PATHS.TIMETABLES, {
            fieldName: "groups_ids",
            fieldValue: groupId,
            opStr: "array-contains",
         });
         setLoading(true);
         const lessons = await getAllDataWithFilter<FBLesson>(q);
         if (!deepCompare(lessons, rawStudentLessons)) {
            dispatch(setLessons({ lessons }));
         }
         setLoading(false);
      },
      [dispatch, rawStudentLessons],
   );

   const loadTeacherTimetable = useCallback(
      async (teacherId: string) => {
         const q = QUERIES.CREATE_SIMPLE_QUERY<FBLesson>(DB_PATHS.TIMETABLES, {
            fieldName: "teachers_ids",
            fieldValue: teacherId,
            opStr: "array-contains",
         });
         setLoading(true);
         const lessons = await getAllDataWithFilter<FBLesson>(q);
         if (!deepCompare(lessons, rawTeacherLessons)) {
            dispatch(setLessons({ lessons }));
         }
         setLoading(false);
      },
      [dispatch, rawTeacherLessons],
   );

   useEffect(() => {
      const loadTimetable = async () => {
         if (user.type === USER_TYPE.STUDENT) {
            // подгрузка расписания для студента
            loadStudentTimetable(user.groupId);
         } else {
            // подгрузка расписания для препода
            loadTeacherTimetable(user.id);
         }
      };
      loadTimetable();
   }, [loadStudentTimetable, loadTeacherTimetable, user]);

   return useMemo(() => {
      const timetable =
         user.type === USER_TYPE.STUDENT
            ? TimetableConverter.toData(rawStudentLessons, user.groupId)
            : TimetableConverter.toData(rawTeacherLessons);

      return {
         timetable,
         loading,
         dayIndex,
         setDayIndex,
      };
   }, [loading, rawStudentLessons, rawTeacherLessons, user, dayIndex, setDayIndex]);
}
