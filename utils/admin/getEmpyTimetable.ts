import { Day, Lesson, LessonDay } from "../../typings";

const days: Day[] = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];

export function getEmptyLessons(): Lesson[] {
   return Array(6)
      .fill(null)
      .map((_, index) => ({
         name: "",
         cabinet: "",
         lessonIndex: index + 1,
      }));
}

export function getEmptyTimetable(): LessonDay[] {
   return days.map((day) => ({
      day,
      lessons: getEmptyLessons(),
   }));
}
