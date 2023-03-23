import { Timestamp } from "../common";

export interface Material {
   id: string;
   disciplineId: string;
   timestamp: Timestamp;
   title: string;
   text: string;
   likes: number;
   ownerId: string;
}

export interface FBMaterial {
   id?: string;
   discipline_id: string;
   timestamp: Timestamp;
   title: string;
   text: string;
   likes: number;
   owner_id: string;
}

export interface Source {
   id: string;
   title: string;
   document: string;
   materialId: string;
}

export interface FBSource {
   id?: string;
   title: string;
   document: string;
   material_id: string;
}

export interface Favorite {
   id: string;
   userId: string;
   materialId: string;
}

export interface FBFavorite {
   id?: string;
   user_id: string;
   material_id: string;
}

export interface Document {
   name: string;
   uri: string;
   type: string | undefined;
}
