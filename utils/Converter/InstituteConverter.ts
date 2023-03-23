import { FBInstitute, Institute } from "../../typings";

export class InstituteConverter {
   public static toData(institute: FBInstitute): Institute {
      return {
         id: institute.id,
         name: institute.name,
         shortName: institute.short_name,
      };
   }
}
