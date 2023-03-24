import type { FBLesson, Timetable } from "../../typings";
import { Lesson } from "../../typings/types/timetable";
import { getEmptyLessons } from "../admin/getEmpyTimetable";
import { isEmpty } from "../isEmpty";

export class TimetableConverter {
   public static toData(lessons: FBLesson[]): Timetable {
      if (isEmpty(lessons)) {
         return null;
      }

      const groupId = lessons[0].group_id ?? null;
      const days: Record<string, Lesson[]> = {};

      Array(6)
         .fill(null)
         .forEach((_, index) => {
            days[index] = getEmptyLessons(index);
         });

      lessons.forEach((lesson) => {
         days[lesson.day_index][lesson.order_index] = TimetableConverter.convertFromApi(lesson);
      });

      const timetable: Timetable = {
         groupId,
         days: Object.keys(days).map((key) => ({
            dayIndex: key,
            lessons: days[key],
         })),
      };

      return timetable;
   }

   public static convertFromApi(FBLesson: FBLesson): Lesson {
      const lesson: Lesson = {
         id: FBLesson.id,
         name: FBLesson.name,
         cabinet: FBLesson.cabinet,
         dayIndex: FBLesson.day_index ?? null,
         orderIndex: FBLesson.order_index ?? null,
         teachersIds: FBLesson.teachers_ids ?? null,
      };
      return lesson;
   }
}
