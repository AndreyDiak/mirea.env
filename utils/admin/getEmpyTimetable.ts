import { Lesson, Timetable } from "../../typings";

export const getEmptyLesson = (dayIndex: number, orderIndex: number): Omit<Lesson, "id"> => ({
   name: "",
   cabinet: "",
   dayIndex,
   orderIndex,
   teachersIds: null,
});

export const getEmptyLessons = (dayIndex: number): Omit<Lesson, "id">[] => {
   return Array(6)
      .fill(null)
      .map((_, lessonIndex) => getEmptyLesson(dayIndex, lessonIndex));
};

export const getEmptyWeekTimetable = (): Timetable => ({
   groupId: null,
   days: Array(6)
      .fill(null)
      .map((_, index) => ({
         dayIndex: String(index),
         lessons: getEmptyLessons(index),
      })),
});
