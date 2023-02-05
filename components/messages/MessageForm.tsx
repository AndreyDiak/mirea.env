import React, { useEffect, useRef, useState } from "react";

import { Keyboard, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Icon } from "@rneui/themed";
import { updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { addMessage } from "../../api";
import { selectUser } from "../../features/userSlice";
import type { DBMessage } from "../../typings";
import { DBQueries } from "../../typings/enums";
import { DOCS, returnHexCode } from "../../utils";

interface EditedMessage {
   text: string;
   id: string;
}

type Props = {
   setIsReplyingOnMessage: (isReply: boolean) => void;
   setIsScrollToBottomVisible: (isVisible: boolean) => void;
   setIsMessageEdited: (isEdited: boolean) => void;
   setActiveMessage: (message: null | DBMessage) => void;
   editedMessageData: EditedMessage;
   isReplyingOnMessage: boolean;
   isMessageEdited: boolean;
   activeMessage: DBMessage | null;
   chatId: string;
};

export const MessageForm: React.FC<Props> = React.memo(
   ({
      setIsReplyingOnMessage,
      setIsScrollToBottomVisible,
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

      useEffect(() => {
         if (isMessageEdited) {
            setMessage(editedMessageData.text);
            messageRef.current.focus();
         }
      }, [editedMessageData.text, isMessageEdited]);

      // sendMessage function
      const sendMessage = async () => {
         setLoading(true);
         if (isMessageEdited) {
            await updateDoc(
               DOCS.CREATE_DOC(DBQueries.CHATS, `${chatId}/messages/${editedMessageData.id}`),
               {
                  text: message,
               },
            ).then(() => {
               Keyboard.dismiss();
               setMessage("");
               setIsMessageEdited(false);
            });
         } else {
            await addMessage(chatId, {
               text: message,
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
         <View style={tw(`w-full bg-white absolute left-0 bottom-0`)}>
            {/* Replying on message */}
            {isReplyingOnMessage && (
               <View
                  style={tw(
                     "flex flex-row items-center justify-between bg-white px-4 py-2 border-b border-gray-200",
                  )}
               >
                  <Icon name="redo" type="material" size={30} color={returnHexCode(user.theme)} />
                  <View style={tw("w-0.5 h-full bg-gray-400 ml-4")} />
                  <View style={tw("flex-1 pl-4")}>
                     <Text style={tw("font-semibold")}>{activeMessage?.displayName}</Text>
                     <Text style={tw("text-gray-400")}>{activeMessage?.text}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setIsReplyingOnMessage(false)}>
                     <Icon name="close" type="material" size={30} color="#374151" />
                  </TouchableOpacity>
               </View>
            )}

            <View style={tw("flex flex-row items-center")}>
               {/* Reply message or Reply Post from discipline... */}
               <TextInput
                  ref={messageRef}
                  onFocus={() => setIsScrollToBottomVisible(false)}
                  style={tw("bg-white flex-1 mr-4 p-3 h-12 text-[18px]")}
                  placeholder="Введите текст..."
                  value={message}
                  onChangeText={setMessage}
               />
               <TouchableOpacity disabled={loading} onPress={sendMessage} style={tw("pr-2")}>
                  <Icon
                     name="send"
                     type="material"
                     color={!loading ? returnHexCode(user.theme) : "#9ca3af"}
                     size={30}
                  />
               </TouchableOpacity>
            </View>
         </View>
      );
   },
);
