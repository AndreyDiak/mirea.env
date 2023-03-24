import { FBGroup, Group } from "../../typings";

export class GroupPatcher {
   public static toApiData(group: Group): FBGroup {
      return {
         name: group.name,
         institute_id: group.instituteId,
      };
   }
}
