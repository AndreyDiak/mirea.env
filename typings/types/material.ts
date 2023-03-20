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

export interface FB_Material {
   discipline_id: string;
   timestamp: Timestamp;
   title: string;
   text: string;
   likes: number;
   owner_id: string;
}

export interface Source {
   title: string;
   document: string;
   materialId: string;
   id: string;
}

export interface FB_Source {
   title: string;
   document: string;
   material_id: string;
}

export interface Document {
   name: string;
   uri: string;
   type: string | undefined;
}

export interface Favorite {
   userId: string;
   materialId: string;
   id: string;
}

export interface FB_Favorite {
   user_id: string;
   material_id: string;
}
