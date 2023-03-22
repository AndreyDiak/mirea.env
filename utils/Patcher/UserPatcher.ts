import { APP_THEME, AppUser, FBAppUser, FBStudent, FBTeacher, Student, UType, User } from "../../typings";

type ConvertUserToApi<A> = Omit<User, "id" | "appTheme"> & {
   type: A extends Student ? UType.STUDENT : UType.TEACHER;
   app_theme: APP_THEME;
};

export class UserPatcher {
   public static toApiData(user: AppUser): FBAppUser {
      if (user.type === UType.STUDENT) {
         const student: FBStudent = {
            ...UserPatcher.convertUserToApi(user),
            group_id: user.groupId,
            institute_id: user.instituteId,
         };
         return student;
      }
      if (user.type === UType.TEACHER) {
         const teacher: FBTeacher = {
            ...UserPatcher.convertUserToApi(user),
            disciplines_ids: user.disciplinesIds ?? [],
            institutes_ids: user.institutesIds ?? [],
         };
         return teacher;
      }

      return null;
   }

   public static convertUserToApi<T extends AppUser>(user: T): ConvertUserToApi<T> {
      return {
         email: user.email,
         name: user.name,
         female: user.female,
         password: user.password,
         img: user.img,
         theme: user.theme,
         app_theme: user.appTheme,
         // TODO @raymix разобраться
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore
         type: user.type,
      };
   }
}
