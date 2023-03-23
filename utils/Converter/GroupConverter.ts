import { FBGroup, Group } from "../../typings";

export class GroupConverter {
   public static toData(group: FBGroup): Group {
      return {
         id: group.id,
         name: group.name,
         instituteId: group.institute_id,
      };
   }
}
