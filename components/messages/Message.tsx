import React, { useEffect, useState } from "react";

import { View } from "react-native";

import { doc, getDoc } from "firebase/firestore";
import { useTailwind } from "tailwind-rn/dist";

import { db } from "../../firebase";
import { FBMessage, Message as MessageType } from "../../typings";
import { APP_THEME, DB_PATHS, USER_THEME } from "../../typings/enums";
import { MessageConverter } from "../../utils";
import { returnAppThemeSecondary, returnHexCode } from "../../utils/returnHexCodes";
import { UserChatAvatar } from "../common";
import { MessageData } from "./MessageData";
import { MessageReply } from "./MessageReply";

interface Props {
   message: MessageType;
   email: string;
   chatId: string;
   theme: USER_THEME;
   appTheme: APP_THEME;
   nextMessageEmail: string | null;
   isBacklight: boolean;
   isLastMessage: boolean;
   setBackligthMessage: () => void;
}

export const Message: React.FC<Props> = React.memo(
   ({
      message,
      email,
      nextMessageEmail,
      isBacklight,
      chatId,
      theme,
      setBackligthMessage,
      isLastMessage,
      appTheme,
   }) => {
      const tw = useTailwind();

      const [replyingMessage, setReplyingMessage] = useState<MessageType>(null);

      const isNextMessageOwner = nextMessageEmail === message.email;
      const isMessageOwner = message.email === email;

      /**
       * гайд по отступам в messages
       * paddingTop -> 15 - если это ласт смс пользователя, 5 - в остальных случаях
       * marginBottom -> 15 - если это ласт смс пользователя, 5 - в остальных случаях
       * paddingLeft -> 10 если владелец сообщения или это не последнее сообщение в списке, 25 - если ласт сообщение (не мое)
       * paddingRight -> 10 если не владелец сообщения или это не последнее сообщение в списке, 25 - если ласт сообщение (мое)
       */

      useEffect(() => {
         const getReplyingMessage = async () => {
            if (message.replyingId) {
               const replyingMessageSnap = await getDoc(
                  doc(db, `${DB_PATHS.CHATS}/${chatId}/messages/${message.replyingId}`),
               );
               const FBReplyingMessage = {
                  ...replyingMessageSnap.data(),
                  id: replyingMessageSnap.id,
               } as FBMessage;
               const ReplyingMessage = MessageConverter.toData(FBReplyingMessage);
               setReplyingMessage(ReplyingMessage);
            }
         };
         getReplyingMessage();
      }, [chatId, message.replyingId]);

      return (
         <View
            style={{
               display: "flex",
               flexDirection: "row",
               paddingHorizontal: 20,
               paddingVertical: 1,
               justifyContent: isMessageOwner ? "flex-end" : "flex-start",
               backgroundColor: isBacklight ? returnAppThemeSecondary(appTheme) : "transparent",
            }}
         >
            <View
               key={message.id}
               style={{
                  padding: 7,
                  borderRadius: 7,
                  paddingTop: isNextMessageOwner ? 5 : 15,
                  // eslint-disable-next-line no-nested-ternary
                  marginBottom: isLastMessage ? 25 : isNextMessageOwner ? 5 : 15,
                  paddingLeft: isMessageOwner || isNextMessageOwner ? 10 : 25,
                  paddingRight: !isMessageOwner || isNextMessageOwner ? 10 : 25,
                  backgroundColor: isMessageOwner ? returnAppThemeSecondary(appTheme) : returnHexCode(theme),
               }}
            >
               {/* Replying message... */}
               <MessageReply
                  reply={replyingMessage}
                  messageEmail={message.email}
                  email={email}
                  appTheme={appTheme}
                  setBackligthMessage={setBackligthMessage}
               />

               <MessageData
                  message={message}
                  email={email}
                  isNextMessageOwner={isNextMessageOwner}
                  appTheme={appTheme}
               />

               {/* Message Owner Avatar... */}
               {!isNextMessageOwner && (
                  <View
                     style={tw(
                        `absolute -bottom-5 
                        ${isMessageOwner ? "-right-7" : "-left-3"}`,
                     )}
                  >
                     <UserChatAvatar title={message.displayName[0]} source={message.photoUrl} size="small" />
                  </View>
               )}
            </View>
         </View>
      );
   },
);
