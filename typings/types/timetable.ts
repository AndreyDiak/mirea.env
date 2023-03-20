export interface Lesson {
   id: string;
   name: string;
   cabinet: string;
   dayIndex: number;
   orderIndex: number;
   groupId: string | null;
   teachersIds: string[] | null;
}

export interface FB_Lesson {
   name: string;
   cabinet: string;
   day_index: number;
   order_index: number;
   group_id: string;
   teachers_ids: string[] | undefined;
}

export type Day = "Понедельник" | "Вторник" | "Среда" | "Четверг" | "Пятница" | "Суббота";
