import { FBInstitute, Institute } from "../../typings";

export class InstituteConverter {
   public static toData(institutes: FBInstitute[]): Institute[] {
      return institutes.map((institute) => ({
         ...InstituteConverter.convertFromApi(institute),
      }));
   }

   public static convertFromApi(institute: FBInstitute): Institute {
      return {
         id: institute.id,
         name: institute.name,
         shortName: institute.short_name,
      };
   }
}
