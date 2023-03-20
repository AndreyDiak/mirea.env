import { Lesson } from "../../typings";

export function getEmptyLessons(dayIndex: number): Omit<Lesson, "id">[] {
   return Array(6)
      .fill(null)
      .map((_, index) => ({
         name: "",
         cabinet: "",
         dayIndex,
         orderIndex: index + 1,
         groupId: null,
         teachersIds: null,
      }));
}
