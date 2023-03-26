import { FBFavorite, FBMaterial, FBSource, Favorite, Material, Source } from "../../typings";

export class MaterialPatcher {
   public static toApiData(material: Partial<Material>): FBMaterial {
      return {
         title: material.title.trim(),
         text: material.text.trim(),
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
