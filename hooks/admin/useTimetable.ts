import { useEffect, useState } from "react";

import { addDoc } from "firebase/firestore";

import { getAllDataWithFilter } from "../../api/queries/getAllDataWIthFilter";
import { Group, Institute, Lesson, LessonDay, TimeTable } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { QUERIES, createCollection } from "../../utils";
import { getEmptyTimetable } from "../../utils/admin/getEmpyTimetable";
import { isEmpty } from "../../utils/isEmpty";

export const useTimetable = () => {
   const [timetable, setTimetable] = useState<LessonDay[]>(getEmptyTimetable());

   const [selectedInstitute, setSelectedInstitute] = useState<Institute>(null);

   const [selectedGroup, setSelectedGroup] = useState<Group>(null);

   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const findGroupTimetable = async () => {
         if (!isEmpty(selectedGroup)) {
            const q = QUERIES.CREATE_SIMPLE_QUERY<TimeTable>(DB_PATHS.TIMETABLES, {
               fieldName: "groupId",
               fieldValue: selectedGroup.id,
               opStr: "==",
            });
            const data = await getAllDataWithFilter<TimeTable>(q);
            if (!isEmpty(data)) {
               setTimetable(data[0].timetable);
            }
         }
      };
      findGroupTimetable();
   }, [selectedGroup]);

   const refreshForm = () => {
      setTimetable(getEmptyTimetable());
      setSelectedGroup(null);
      setSelectedInstitute(null);
      setLoading(false);
   };

   const loadTimetable = async () => {
      if (isEmpty(selectedGroup)) {
         return;
      }
      setLoading(true);
      await addDoc(createCollection(DB_PATHS.TIMETABLES), {
         groupId: selectedGroup.id,
         timetable,
      });
      refreshForm();
   };

   const handleInstitute = (institute: Institute) => {
      setSelectedInstitute(institute);
   };

   const handleGroup = (group: Group) => {
      setSelectedGroup(group);
   };

   const handleTimetable = (dayIndex: number, newLessons: Lesson[]) => {
      const copy = [...timetable];
      copy[dayIndex].lessons = newLessons;
      setTimetable(copy);
   };

   return {
      timetable,
      institute: selectedInstitute,
      group: selectedGroup,
      loading,
      loadTimetable,
      handleGroup,
      handleInstitute,
      handleTimetable,
   };
};
