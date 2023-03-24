import { Discipline, FBDiscipline } from "../../typings";

export class DisciplineConverter {
   public static toData(disciplines: FBDiscipline[]): Discipline[] {
      return disciplines.map((discipline) => ({
         ...DisciplineConverter.convertFromApi(discipline),
      }));
   }

   public static convertFromApi(discipline: FBDiscipline): Discipline {
      return {
         id: discipline.id,
         instituteId: discipline.institute_id,
         name: discipline.name,
      };
   }
}
