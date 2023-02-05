import { Student, Teacher, User } from "../typings";
import { UType } from "../typings/enums";

type TemplateUser = Omit<User, "userId" | "email" | "password">;

type TemplateStudent = Pick<Student, "groupId" | "instituteId" | "type"> & TemplateUser;

type TemplateTeacher = Pick<Teacher, "disciplines" | "institutes" | "type"> & TemplateUser;

export const getUserTemplate = (): TemplateUser => ({
   female: null,
   name: null,
   theme: "blue",
   img: "",
});

export const getStudentTemplate = (): TemplateStudent => ({
   ...getUserTemplate(),
   instituteId: null,
   groupId: null,
   type: UType.STUDENT,
});

export const getTeacherTemplate = (): TemplateTeacher => ({
   ...getUserTemplate(),
   institutes: null,
   disciplines: null,
   type: UType.TEACHER,
});
