import { Comment, FBComment } from "../../typings";

export class CommentConverter {
   public static toData(comments: FBComment[]): Comment[] {
      return comments.map((comment) => ({
         ...CommentConverter.convertFromApi(comment),
      }));
   }

   public static convertFromApi(comment: FBComment): Comment {
      return {
         id: comment.id,
         text: comment.text,
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore
         timestamp: comment.timestamp,
         ownerEmail: comment.owner_email,
         materialId: comment.material_id,
      };
   }
}
