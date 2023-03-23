import { APP_THEME, AppUser, FBAppUser, Student, Teacher, USER_TYPE } from "../../typings";
import { FBStudent, FBTeacher } from "../../typings/types/user";

type ConvertUserFromApi<T> = Omit<FBAppUser, "app_theme"> & {
   type: T extends FBStudent ? USER_TYPE.STUDENT : USER_TYPE.TEACHER;
   appTheme: APP_THEME;
};

export class UserConverter {
   public static toData(user: FBAppUser): AppUser {
      if (user.type === USER_TYPE.STUDENT) {
         const student: Student = {
            ...UserConverter.convertUserFromApi(user),
            groupId: user.group_id,
            instituteId: user.institute_id,
         };
         return student;
      }
      if (user.type === USER_TYPE.TEACHER) {
         const teacher: Teacher = {
            ...UserConverter.convertUserFromApi(user),
            disciplinesIds: user.disciplines_ids,
            institutesIds: user.institutes_ids,
         };
         return teacher;
      }
      return null;
   }

   static convertUserFromApi(user: FBStudent): ConvertUserFromApi<FBStudent>;

   static convertUserFromApi(user: FBTeacher): ConvertUserFromApi<FBTeacher>;

   public static convertUserFromApi(user: FBAppUser): ConvertUserFromApi<FBAppUser> {
      return {
         id: user.id,
         email: user.email,
         name: user.name,
         female: user.female,
         password: user.password,
         img: user.img,
         appTheme: user.app_theme,
         theme: user.theme,
         type: user.type,
      };
   }
}
