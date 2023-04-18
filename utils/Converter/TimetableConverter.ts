import type { FBLesson, Timetable } from "../../typings";
import { Lesson } from "../../typings/types/timetable";
import { getEmptyLessons } from "../admin/getEmpyTimetable";
import { isEmpty } from "../isEmpty";

export class TimetableConverter {
   public static toData(lessons: FBLesson[], groupId: string = null): Timetable {
      if (isEmpty(lessons)) {
         return null;
      }

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
      return {
         id: FBLesson.id,
         name: FBLesson.name,
         cabinet: FBLesson.cabinet,
         dayIndex: FBLesson.day_index ?? null,
         orderIndex: FBLesson.order_index ?? null,
         groupsIds: FBLesson.groups_ids ?? null,
         teachersIds: FBLesson.teachers_ids ?? null,
      };
   }
}
