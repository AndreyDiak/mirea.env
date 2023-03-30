import { useCallback, useEffect, useMemo, useState } from "react";

import { addDoc, updateDoc } from "firebase/firestore";

import { getAllDataWithFilter } from "../../api/queries/getAllDataWIthFilter";
import type { Discipline, FBLesson, Group, Institute, Lesson, Teacher, Timetable } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import {
   DOCS,
   QUERIES,
   TimetableConverter,
   TimetablePatcher,
   createCollection,
   getEmptyWeekTimetable,
} from "../../utils";
import { isEmpty } from "../../utils/isEmpty";

interface UseTimetable {
   handleGroup: (group: Group) => void;
   handleInstitute: (institute: Institute) => void;
   handleTimetable: (dayIndex: number, newLessons: Lesson[]) => void;
   loadTimetable: () => Promise<void>;
   loading: boolean; // ожидание загрузки расписания в БД
   group: Group | null;
   institute: Institute | null;
   disciplines: Discipline[] | null;
   teachers: Teacher[] | null;
   timetable: Timetable;
}

export function useTimetable(): UseTimetable {
   const [timetable, setTimetable] = useState<Timetable>(getEmptyWeekTimetable());

   const [selectedInstitute, setSelectedInstitute] = useState<Institute>(null);

   const [selectedGroup, setSelectedGroup] = useState<Group>(null);

   const [availableDisciplines, setAvalableDisciplines] = useState<Discipline[]>(null);

   const [availableTeachers, setAvailableTeachers] = useState<Teacher[]>(null);

   const [loading, setLoading] = useState(false);

   // получаем доступные дисциплины исходя из института
   useEffect(() => {
      let active = true;
      const findAvailableDisciplines = async () => {
         if (isEmpty(selectedInstitute)) return;

         const q = QUERIES.CREATE_SIMPLE_QUERY<Discipline>(DB_PATHS.DISCIPLINES, {
            fieldName: "instituteId",
            fieldValue: selectedInstitute.id,
            opStr: "==",
         });
         const disciplines = await getAllDataWithFilter<Discipline>(q);
         if (!active) return;
         setAvalableDisciplines(disciplines);
      };

      findAvailableDisciplines();
      return () => {
         active = false;
      };
   }, [selectedInstitute]);

   useEffect(() => {
      let active = true;
      const findAvaliableTeachers = async () => {
         if (isEmpty(selectedInstitute)) return;

         const q = QUERIES.CREATE_SIMPLE_QUERY<Teacher>(DB_PATHS.USERS, {
            fieldName: "institutesIds",
            fieldValue: selectedInstitute.id,
            opStr: "array-contains",
         });
         const data = await getAllDataWithFilter<Teacher>(q);
         if (!active) return;
         setAvailableTeachers(data);
      };

      findAvaliableTeachers();
      return () => {
         active = false;
      };
   });

   // загружаем расписание если для данной группы оно уже создано
   useEffect(() => {
      let active = true;
      const findGroupTimetable = async () => {
         if (!isEmpty(selectedGroup)) {
            const q = QUERIES.CREATE_SIMPLE_QUERY<FBLesson>(DB_PATHS.TIMETABLES, {
               fieldName: "groups_ids",
               fieldValue: selectedGroup.id,
               opStr: "array-contains",
            });
            const data = await getAllDataWithFilter<FBLesson>(q);
            if (!active) return;
            if (!isEmpty(data)) {
               setTimetable(TimetableConverter.toData(data, selectedGroup.id));
            }
         }
      };
      findGroupTimetable();
      return () => {
         active = false;
      };
   }, [selectedGroup]);

   const refreshForm = useCallback(() => {
      setTimetable(getEmptyWeekTimetable());
      setSelectedGroup(null);
      setSelectedInstitute(null);
      setLoading(false);
   }, []);

   const loadTimetable = useCallback(async () => {
      if (isEmpty(selectedGroup)) {
         return;
      }
      setLoading(true);
      const lessons = TimetablePatcher.toApiData(timetable);

      await Promise.all(
         lessons.map(async (lesson) => {
            const lessonId = lesson.id ?? null;
            const FBLesson = TimetablePatcher.convertToApi(lesson, selectedGroup.id);
            // если у нас есть id то мы обновляем документ
            if (lessonId) {
               await updateDoc(DOCS.CREATE_DOC(DB_PATHS.TIMETABLES, lesson.id), {
                  ...FBLesson,
               });
            } else {
               // если нет id то добавляем новый док
               await addDoc(createCollection(DB_PATHS.TIMETABLES), {
                  ...FBLesson,
               });
            }
         }),
      ).then(() => {
         console.log("timetable added!");
      });
      setLoading(false);
      refreshForm();
   }, [refreshForm, selectedGroup, timetable]);

   const handleInstitute = useCallback((institute: Institute) => {
      setSelectedInstitute(institute);
   }, []);

   const handleGroup = useCallback((group: Group) => {
      setSelectedGroup(group);
      if (!isEmpty(group)) {
         setTimetable((prev) => ({
            ...prev,
            groupId: group.id,
         }));
      }
   }, []);

   const handleTimetable = useCallback(
      (dayIndex: number, newLessons: Lesson[]) => {
         const copy = { ...timetable };
         copy.days[dayIndex].lessons = newLessons;
         setTimetable(copy);
      },
      [timetable],
   );

   return useMemo(
      () => ({
         timetable,
         institute: selectedInstitute,
         group: selectedGroup,
         disciplines: availableDisciplines,
         teachers: availableTeachers,
         loading,
         loadTimetable,
         handleGroup,
         handleInstitute,
         handleTimetable,
      }),
      [
         availableDisciplines,
         availableTeachers,
         handleGroup,
         handleInstitute,
         handleTimetable,
         loadTimetable,
         loading,
         selectedGroup,
         selectedInstitute,
         timetable,
      ],
   );
}
