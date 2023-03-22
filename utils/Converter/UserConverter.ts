import { APP_THEME, AppUser, FBAppUser, Student, Teacher, UType } from "../../typings";
import { FBStudent } from "../../typings/types/user";

type ConvertUserFromApi<T> = Omit<FBAppUser, "app_theme" | "type"> & {
   appTheme: APP_THEME;
   type: T extends FBStudent ? UType.STUDENT : UType.TEACHER;
};

export class UserConverter {
   public static toData(user: FBAppUser): AppUser {
      if (user.type === UType.STUDENT) {
         const student: Student = {
            ...UserConverter.convertUserFromApi(user),
            groupId: user.group_id,
            instituteId: user.institute_id,
         };
         return student;
      }
      if (user.type === UType.TEACHER) {
         const teacher: Teacher = {
            ...UserConverter.convertUserFromApi(user),
            disciplinesIds: user.disciplines_ids,
            institutesIds: user.institutes_ids,
         };
         return teacher;
      }
      return null;
   }

   public static convertUserFromApi<T extends FBAppUser>(user: T): ConvertUserFromApi<T> {
      return {
         id: user?.id ?? null,
         email: user.email,
         name: user.name,
         female: user.female,
         password: user.password,
         img: user.img,
         appTheme: user.app_theme,
         theme: user.theme,
         // TODO @raymix разобраться
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore
         type: user.type,
      };
   }
}
