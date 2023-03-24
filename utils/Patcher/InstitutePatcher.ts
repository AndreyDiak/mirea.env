import { FBInstitute, Institute } from "../../typings";

export class InstitutePatcher {
   public static toApiData(institute: Institute): FBInstitute {
      return {
         name: institute.name,
         short_name: institute.shortName,
      };
   }
}
