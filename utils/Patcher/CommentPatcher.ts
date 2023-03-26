import { FieldValue } from "firebase/firestore";

import { Comment, FBComment } from "../../typings";

export class CommentPatcher {
   public static toApiData(chat: Comment): FBComment {
      return {
         text: chat.text,
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore
         timestamp: chat.timestamp as FieldValue,
         owner_email: chat.ownerEmail,
      };
   }
}
