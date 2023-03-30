import { FBMessage, Message } from "../../typings";

export class MessagePatcher {
   public static toApiData(message: Partial<Message>): FBMessage {
      return {
         email: message.email,
         text: message.text,
         timestamp: message.timestamp,
         type: message.type,
         display_name: message.displayName,
         photo_url: message.photoUrl,
         replying_id: message.replyingId,
      };
   }
}
