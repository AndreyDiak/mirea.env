import React, { useCallback, useState } from "react";

import { Keyboard, View } from "react-native";

import { updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { addMessage } from "../../api";
import { selectUser } from "../../features/slices/userSlice";
import { EditedMessage } from "../../hooks";
import type { Message, NewMessage } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { DOCS } from "../../utils";
import { CustomInputField } from "../common/form/CustomInputField";

interface Props {
   onReplyEndMessage(): void;
   setIsReplying: (isReplying: boolean) => void;
   setIsEdited: (isEdited: boolean) => void;

   editedMessage: EditedMessage;
   isReplying: boolean;
   isEdited: boolean;
   activeMessage: Message | null;
   chatId: string;
}

export const MessageForm: React.FC<Props> = React.memo(
   ({
      onReplyEndMessage,
      setIsReplying,
      setIsEdited,
      editedMessage,
      isReplying,
      isEdited,
      activeMessage,
      chatId,
   }) => {
      const tw = useTailwind();
      const [message, setMessage] = useState<string>("");
      const [loading, setLoading] = useState<boolean>(false);
      const user = useSelector(selectUser);

      // sendMessage function
      const sendMessage = useCallback(async () => {
         setLoading(true);
         if (isEdited) {
            await updateDoc(DOCS.CREATE_DOC(DB_PATHS.CHATS, `${chatId}/messages/${editedMessage.id}`), {
               text: message,
            }).then(() => {
               Keyboard.dismiss();
               setMessage("");
               setIsEdited(false);
            });
         } else {
            const newMessage: NewMessage = {
               text: message.trim(),
               displayName: user.name,
               email: user.email,
               type: user.type,
               photoUrl: user.img,
               replyingId: isReplying ? activeMessage?.id : "",
            };

            await addMessage(chatId, newMessage).then(() => {
               Keyboard.dismiss();
               setMessage("");
               if (isReplying) {
                  onReplyEndMessage();
               }
            });
         }

         setLoading(false);
      }, [
         activeMessage?.id,
         chatId,
         editedMessage.id,
         isEdited,
         isReplying,
         message,
         onReplyEndMessage,
         setIsEdited,
         user.email,
         user.img,
         user.name,
         user.type,
      ]);

      return (
         <View style={tw(`w-full bg-white`)}>
            {/* Replying on message */}
            {/* Поле ввода текста сообщения */}
            <CustomInputField
               value={message}
               loading={loading}
               isReplying={isReplying}
               replyData={{
                  replyMessage: activeMessage,
                  replyHandler: () => setIsReplying(false),
               }}
               setValue={setMessage}
               onSubmit={sendMessage}
            />
         </View>
      );
   },
);
