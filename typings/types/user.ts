import { APP_THEME, USER_THEME, USER_TYPE } from "../enums";

export interface User {
   id?: string;
   email: string;
   name: string;
   female: string;
   password: string;
   img: string;
   theme: USER_THEME;
   appTheme: APP_THEME;
}

export interface Student extends User {
   groupId: string | null;
   instituteId: string | null;
   type: USER_TYPE.STUDENT;
}

export interface FBStudent {
   id?: string;
   email: string;
   name: string;
   female: string;
   password: string;
   img: string;
   theme: USER_THEME;
   app_theme: APP_THEME;
   group_id: string | undefined;
   institute_id: string | undefined;
   type: USER_TYPE.STUDENT;
}

export interface Teacher extends User {
   disciplinesIds: string[] | null;
   institutesIds: string[] | null;
   type: USER_TYPE.TEACHER;
}

export interface FBTeacher {
   id?: string;
   email: string;
   name: string;
   female: string;
   password: string;
   img: string;
   theme: USER_THEME;
   app_theme: APP_THEME;
   disciplines_ids: string[] | undefined;
   institutes_ids: string[] | undefined;
   type: USER_TYPE.TEACHER;
}

export type AppUser = Student | Teacher;

export type FBAppUser = FBStudent | FBTeacher;
