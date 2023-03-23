import {
   APP_THEME,
   AppUser,
   FBAppUser,
   FBStudent,
   FBTeacher,
   Student,
   Teacher,
   USER_TYPE,
   User,
} from "../../typings";

type ConvertUserToApi<T> = Omit<User, "id" | "appTheme"> & {
   type: T extends Student ? USER_TYPE.STUDENT : USER_TYPE.TEACHER;
   app_theme: APP_THEME;
};

export class UserPatcher {
   public static toApiData(user: AppUser): FBAppUser {
      if (user.type === USER_TYPE.STUDENT) {
         const student: FBStudent = {
            ...UserPatcher.convertUserToApi(user),
            group_id: user.groupId,
            institute_id: user.instituteId,
         };
         return student;
      }
      if (user.type === USER_TYPE.TEACHER) {
         const teacher: FBTeacher = {
            ...UserPatcher.convertUserToApi(user),
            disciplines_ids: user.disciplinesIds ?? [],
            institutes_ids: user.institutesIds ?? [],
         };
         return teacher;
      }

      return null;
   }

   static convertUserToApi(user: Student): ConvertUserToApi<Student>;

   static convertUserToApi(user: Teacher): ConvertUserToApi<Teacher>;

   public static convertUserToApi(user: AppUser): ConvertUserToApi<AppUser> {
      return {
         email: user.email,
         name: user.name,
         female: user.female,
         password: user.password,
         img: user.img,
         theme: user.theme,
         app_theme: user.appTheme,
         type: user.type,
      };
   }
}
