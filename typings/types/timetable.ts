export interface Lesson {
   id?: string;
   name: string;
   cabinet: string;
   dayIndex: number | null;
   orderIndex: number | null;
   teachersIds: string[] | null;
}

export interface PreviewLesson {
   name: string;
   cabinet: string;
   teachersNames: string[] | null;
}

export interface FBLesson {
   id?: string;
   name: string;
   cabinet: string;
   day_index: number | undefined;
   order_index: number | undefined;
   group_id: string | undefined;
   teachers_ids: string[] | undefined;
}

/* Timetable это сущность на один день
 * в патчере из Timetable мы возвращам массив Lesson-ов
 * и пушим уже его в БД
 */

export interface TimetableDay {
   dayIndex: string;
   lessons: Lesson[];
}
export interface Timetable {
   groupId: string | null;
   days: TimetableDay[];
}

export type Day = "Понедельник" | "Вторник" | "Среда" | "Четверг" | "Пятница" | "Суббота";
