import { useCallback, useMemo, useState } from "react";

import { Message } from "../../typings";

export interface EditedMessage {
   text: string;
   id: string;
}

interface UseChatData {
   isScrollButtonShown: boolean;
   isHeaderMenuShown: boolean;
   isReplying: boolean;
   isEdited: boolean;
   activeMessage: Message;
   editedMessage: EditedMessage;

   onReplyMessage(): void;
   onReplyEndMessage(): void;
   onHeaderClose(): void;
   onEditMessage(): void;
   onLongPressMessage(message: Message): void;

   setIsScrollButtonShown(isScrollButtonShown: boolean): void;
   setIsReplying(isReplying: boolean): void;
   setIsEdited(isEdited: boolean): void;
}

export function useChatData(): UseChatData {
   const [isReplying, setIsReplying] = useState(false);
   const [isHeaderMenuShown, setIsHeaderMenuShown] = useState(false);

   const [isEdited, setIsEdited] = useState(false);
   const [isScrollButtonShown, setIsScrollButtonShown] = useState(false);

   const [activeMessage, setActiveMessage] = useState<Message>(null);
   const [editedMessage, setEditedMessage] = useState<EditedMessage>({
      text: "",
      id: "",
   });

   const onReplyMessage = useCallback(() => {
      setIsReplying(true);
      setIsHeaderMenuShown(true);
   }, []);

   const onReplyEndMessage = useCallback(() => {
      setIsReplying(false);
      setActiveMessage(null);
   }, []);

   const onHeaderClose = useCallback(() => {
      setIsHeaderMenuShown(false);
      setActiveMessage(null);
   }, []);

   const onEditMessage = useCallback(() => {
      setIsEdited(true);
      setEditedMessage({
         id: activeMessage.id,
         text: activeMessage.text,
      });
      onHeaderClose();
   }, [activeMessage.id, activeMessage.text, onHeaderClose]);

   const onLongPressMessage = useCallback((message: Message) => {
      setIsHeaderMenuShown(true);
      setActiveMessage(message);
   }, []);

   return useMemo(() => {
      return {
         isScrollButtonShown,
         isHeaderMenuShown,
         isReplying,
         isEdited,
         activeMessage,
         editedMessage,
         onReplyMessage,
         onHeaderClose,
         onEditMessage,
         onLongPressMessage,
         onReplyEndMessage,
         setIsScrollButtonShown,
         setIsReplying,
         setIsEdited,
      };
   }, [
      isScrollButtonShown,
      isHeaderMenuShown,
      isReplying,
      isEdited,
      activeMessage,
      editedMessage,
      onReplyMessage,
      onHeaderClose,
      onEditMessage,
      onLongPressMessage,
      onReplyEndMessage,
   ]);
}
