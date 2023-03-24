import { FBGroup, Group } from "../../typings";

export class GroupConverter {
   public static toData(groups: FBGroup[]): Group[] {
      return groups.map((group) => ({
         ...GroupConverter.convertFromApi(group),
      }));
   }

   public static convertFromApi(group: FBGroup): Group {
      return {
         id: group.id,
         name: group.name,
         instituteId: group.institute_id,
      };
   }
}
