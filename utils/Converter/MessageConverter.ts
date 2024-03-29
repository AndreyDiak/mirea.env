import { FBMessage, Message } from "../../typings";

export class MessageConverter {
   public static toData(messages: FBMessage[]): Message[] {
      return messages.map((message) => ({
         ...MessageConverter.convertFromApi(message),
      }));
   }

   public static convertFromApi(message: FBMessage): Message {
      return {
         id: message.id,
         email: message.email,
         text: message.text,
         timestamp: message.timestamp,
         type: message.type,
         displayName: message.display_name,
         photoUrl: message.photo_url,
         replyingId: message.replying_id,
      };
   }
}
