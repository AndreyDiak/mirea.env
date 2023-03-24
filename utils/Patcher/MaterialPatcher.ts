import { FBFavorite, FBMaterial, FBSource, Favorite, Material, Source } from "../../typings";

export class MaterialPatcher {
   public static toAPiData(material: Material): FBMaterial {
      return {
         id: material.id,
         title: material.title,
         text: material.text,
         likes: material.likes,
         timestamp: material.timestamp,
         owner_id: material.ownerId,
         discipline_id: material.disciplineId,
      };
   }

   public static convertSourceToApi(source: Source): FBSource {
      return {
         id: source.id,
         title: source.title,
         document: source.document,
         material_id: source.materialId,
      };
   }

   public static convertFavoriteToApi(favorite: Favorite): FBFavorite {
      return {
         id: favorite.id,
         user_id: favorite.userId,
         material_id: favorite.materialId,
      };
   }
}
