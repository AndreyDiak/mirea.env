import React, { useEffect, useRef, useState } from "react";

import { Keyboard, View } from "react-native";

import { updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { addMessage } from "../../api";
import { selectUser } from "../../features/userSlice";
import type { DBMessage } from "../../typings";
import { DB_PATHS } from "../../typings/enums";
import { DOCS } from "../../utils";
import { CustomInputField } from "../common/form/CustomInputField";

interface EditedMessage {
   text: string;
   id: string;
}

interface Props {
   setIsReplyingOnMessage: (isReply: boolean) => void;
   setIsScrollToBottomVisible: (isVisible: boolean) => void;
   setIsMessageEdited: (isEdited: boolean) => void;
   setActiveMessage: (message: null | DBMessage) => void;
   editedMessageData: EditedMessage;
   isReplyingOnMessage: boolean;
   isMessageEdited: boolean;
   activeMessage: DBMessage | null;
   chatId: string;
}

export const MessageForm: React.FC<Props> = React.memo(
   ({
      setIsReplyingOnMessage,
      setActiveMessage,
      setIsMessageEdited,
      editedMessageData,
      isReplyingOnMessage,
      isMessageEdited,
      activeMessage,
      chatId,
   }) => {
      const tw = useTailwind();
      const [message, setMessage] = useState<string>("");
      const [loading, setLoading] = useState<boolean>(false);
      const user = useSelector(selectUser);

      const messageRef = useRef(null);

      // sendMessage function
      const sendMessage = async () => {
         setLoading(true);
         if (isMessageEdited) {
            await updateDoc(DOCS.CREATE_DOC(DB_PATHS.CHATS, `${chatId}/messages/${editedMessageData.id}`), {
               text: message,
            }).then(() => {
               Keyboard.dismiss();
               setMessage("");
               setIsMessageEdited(false);
            });
         } else {
            await addMessage(chatId, {
               text: message.trimEnd(),
               displayName: user.name,
               email: user.email,
               type: user.type,
               photoUrl: user.img,
               replyingId: isReplyingOnMessage ? activeMessage?.id : "",
            }).then(() => {
               Keyboard.dismiss();
               setMessage("");
               if (isReplyingOnMessage) {
                  setIsReplyingOnMessage(false);
                  setActiveMessage(null);
               }
            });
         }

         setLoading(false);
      };

      return (
         <View style={tw(`w-full bg-white`)}>
            {/* Replying on message */}
            {/* Поле ввода текста сообщения */}
            <CustomInputField
               value={message}
               loading={loading}
               ref={messageRef}
               isReplying={isReplyingOnMessage}
               replyData={{
                  replyMessage: activeMessage,
                  replyHandler: () => setIsReplyingOnMessage(false),
               }}
               setValue={setMessage}
               onSubmit={sendMessage}
            />
         </View>
      );
   },
);
