import { FBLesson, Lesson, Timetable } from "../../typings";
import { isEmpty } from "../isEmpty";

export class TimetablePatcher {
   public static toApiData(timetable: Timetable): Lesson[] {
      const lessons: Lesson[] = [];

      timetable.days.forEach((day) => {
         day.lessons.forEach((lesson) => {
            if (!isEmpty(lesson.name) && !isEmpty(lesson.cabinet)) {
               lessons.push(lesson);
            }
         });
      });
      return lessons;
   }

   public static convertToApi(lesson: Lesson, groupId: string): FBLesson {
      const DBLesson: FBLesson = {
         name: lesson.name.trim(),
         cabinet: lesson.cabinet.trim(),
         day_index: lesson.dayIndex,
         order_index: lesson.orderIndex,
         groups_ids: [groupId],
         teachers_ids: lesson.teachersIds ?? [],
      };
      return DBLesson;
   }
}
