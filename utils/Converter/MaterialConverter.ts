import { FBFavorite, FBMaterial, FBSource, Favorite, Material, Source } from "../../typings";

export class MaterialConverter {
   public static toData(materials: FBMaterial[]): Material[] {
      return materials.map((material) => ({
         ...MaterialConverter.convertMaterialFromApi(material),
      }));
   }

   public static convertMaterialFromApi(material: FBMaterial): Material {
      return {
         id: material.id,
         title: material.title,
         text: material.text,
         likes: material.likes,
         timestamp: material.timestamp,
         ownerId: material.owner_id,
         disciplineId: material.discipline_id,
      };
   }

   public static convertSourceFromApi(source: FBSource): Source {
      return {
         id: source.id,
         title: source.title,
         document: source.document,
         materialId: source.material_id,
      };
   }

   public static convertFavoriteFromApi(favorite: FBFavorite): Favorite {
      return {
         id: favorite.id,
         userId: favorite.user_id,
         materialId: favorite.material_id,
      };
   }
}
