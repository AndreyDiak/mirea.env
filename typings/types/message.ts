import { Timestamp } from "../common";

export interface Message {
   id: string;
   text: string;
   timestamp: Timestamp;
   displayName: string;
   email: string;
   type: string;
   photoUrl: string;
   replyingId?: string;
}

export interface FBMessage {
   id?: string;
   text: string;
   timestamp: Timestamp;
   display_name: string;
   email: string;
   type: string;
   photo_url: string;
   replying_id: string | null;
}

export type NewMessage = Omit<Message, "timestamp" | "id">;
