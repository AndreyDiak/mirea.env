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

export interface FB_Message {
   text: string;
   timestamp: Timestamp;
   display_name: string;
   email: string;
   type: string;
   photo_url: string;
   replying_id: string | null;
}
