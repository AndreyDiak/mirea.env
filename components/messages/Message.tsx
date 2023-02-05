import React, { useEffect, useState } from "react";

import { View } from "react-native";

import { doc, getDoc } from "firebase/firestore";
import { useTailwind } from "tailwind-rn/dist";

import { db } from "../../firebase";
import { AppTheme, DBMessage } from "../../typings";
import { DBQueries } from "../../typings/enums";
import { returnHexCode, returnLightenHexCode } from "../../utils/returnHexCodes";
import { UserAvatar } from "../UserAvatar";
import { MessageData } from "./MessageData";
import { MessageReply } from "./MessageReply";

type Props = {
   message: DBMessage;
   email: string;
   chatId: string;
   theme: AppTheme;
   nextMessageEmail: string | null;
   isBacklight: boolean;
   setBackligthMessage: () => void;
};

export const Message: React.FC<Props> = React.memo(
   ({ message, email, nextMessageEmail, isBacklight, chatId, theme, setBackligthMessage }) => {
      const tw = useTailwind();

      const [replyingMessage, setReplyingMessage] = useState<DBMessage>(null);

      useEffect(() => {
         const getReplyingMessage = async () => {
            if (message.replyingId) {
               const replyingMessageSnap = await getDoc(
                  doc(db, `${DBQueries.CHATS}/${chatId}/messages/${message.replyingId}`),
               );
               setReplyingMessage({
                  ...replyingMessageSnap.data(),
                  id: replyingMessageSnap.id,
               } as DBMessage);
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
               justifyContent: message.email === email ? "flex-end" : "flex-start",
               backgroundColor: isBacklight ? returnLightenHexCode(theme) : "transparent",
            }}
         >
            <View
               key={message.id}
               style={{
                  padding: 7,
                  borderRadius: 7,
                  paddingTop: message.email === email ? 5 : 15,
                  paddingLeft:
                     // eslint-disable-next-line no-nested-ternary
                     message.email === email ? 10 : nextMessageEmail === message.email ? 10 : 25,
                  paddingRight:
                     // eslint-disable-next-line no-nested-ternary
                     message.email === email ? (nextMessageEmail === message.email ? 10 : 25) : 10,
                  marginBottom: nextMessageEmail === message.email ? 5 : 15,
                  backgroundColor: message.email === email ? "white" : returnHexCode(theme),
               }}
            >
               {/* Replying message... */}
               <MessageReply
                  reply={replyingMessage}
                  messageEmail={message.email}
                  email={email}
                  setBackligthMessage={setBackligthMessage}
               />

               <MessageData message={message} email={email} />

               {/* Message Owner Avatar... */}
               {nextMessageEmail !== message.email && (
                  <View
                     style={tw(
                        `absolute -bottom-5 
            ${message.email === email ? "-right-7" : "-left-3"}`,
                     )}
                  >
                     <UserAvatar
                        title={message.displayName[0]}
                        source={message.photoUrl}
                        size="small"
                     />
                  </View>
               )}
            </View>
         </View>
      );
   },
);
