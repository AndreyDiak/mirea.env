import { Discipline, FBDiscipline } from "../../typings";

export class DisciplineConverter {
   public static toData(discipline: FBDiscipline): Discipline {
      return {
         id: discipline.id,
         instituteId: discipline.institute_id,
         name: discipline.name,
      };
   }
}
