import { Timestamp } from "../common";

export interface Comment {
   id: string;
   text: string;
   timestamp: Timestamp;
   ownerEmail: string;
   materialId: string;
}

export interface FBComment {
   id?: string;
   text: string;
   timestamp: Timestamp;
   owner_email: string;
   material_id: string;
}