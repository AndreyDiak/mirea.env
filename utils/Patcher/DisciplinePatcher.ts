import { Discipline, FBDiscipline } from "../../typings";

export class DisciplinePatcher {
   public static toApiData(discipline: Discipline): FBDiscipline {
      return {
         name: discipline.name,
         institute_id: discipline.instituteId,
      };
   }
}
