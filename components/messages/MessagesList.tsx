import React, { useCallback, useRef, useState } from "react";

import { FlatList, TouchableOpacity } from "react-native";

import { Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { selectUser } from "../../features/userSlice";
import { useMessages } from "../../hooks";
import type { DBMessage } from "../../typings";
import { isEmpty, returnHexCode } from "../../utils";
import { CenteredText } from "../common";
import { Message } from "./Message";
import { MessagesScrollToBottom } from "./MessagesScrollToBottom";

type Props = {
   chatId: string;
   isScrollToBottomVisible: boolean;
   selectedMessageId: string | undefined;
   setIsScrollToBottomVisible: (isVisible: boolean) => void;
   setSelectedMessage: (selectedMessage: DBMessage) => void;
   setIsHeaderMenuVisible: (isVisible: boolean) => void;
};

export function MessagesList({
   chatId,
   isScrollToBottomVisible,
   selectedMessageId,
   setIsScrollToBottomVisible,
   setSelectedMessage,
   setIsHeaderMenuVisible,
}: Props) {
   const tw = useTailwind();
   const user = useSelector(selectUser);
   const flatListRef = useRef(null);

   const [backligthMessage, setBackligntMessage] = useState<string | null>(null);
   const { messages, loading } = useMessages(chatId);

   const scrollToIndex = useCallback(
      (activeMessageIndex: string | null) => {
         if (activeMessageIndex) {
            flatListRef.current.scrollToIndex({
               animating: true,
               index: messages.findIndex((msg) => msg.id === activeMessageIndex),
            });
         }
      },
      [messages],
   );

   // scrollToBottom function
   const scrollToBottom = useCallback(() => {
      flatListRef.current.scrollToEnd({ animating: true });
      setIsScrollToBottomVisible(false);
   }, [setIsScrollToBottomVisible]);

   // onMessagePress function...
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const onMessagePress = (message: DBMessage) => {
      // fast press on message
   };

   // onMessageLongPress function...
   const onMessageLongPress = useCallback(
      (message: DBMessage) => {
         setIsHeaderMenuVisible(true);
         setSelectedMessage(message);
      },
      [setIsHeaderMenuVisible, setSelectedMessage],
   );

   if (loading && isEmpty(messages)) {
      return (
         <CenteredText
            text="Загрузка сообщений"
            Icon={
               <Icon name="chat-bubble-outline" type="material" color={returnHexCode(user.theme)} size={30} />
            }
         />
      );
   }

   if (isEmpty(messages)) {
      return (
         <CenteredText
            text="Напишите первое сообщение!"
            Icon={
               <Icon name="chat-bubble-outline" type="material" color={returnHexCode(user.theme)} size={30} />
            }
         />
      );
   }

   return (
      <>
         <MessagesScrollToBottom isVisible={isScrollToBottomVisible} handleScroll={scrollToBottom} />

         <FlatList
            ref={flatListRef}
            style={tw("w-full flex-1 py-2 mb-16")}
            data={messages}
            scrollEnabled
            // добавляем кнопку если добавились сообщения
            onContentSizeChange={() => {
               setIsScrollToBottomVisible(true);
            }}
            // когда мы доскролили убираем кнопку
            // onScrollEndDrag={() => {
            //    if (!isScrollToBottomVisible) {
            //       setIsScrollToBottomVisible(true);
            //    }
            // }}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
               if (isScrollToBottomVisible) {
                  setIsScrollToBottomVisible(false);
               }
            }}
            // TODO у каждого пользователя должна хранится инфа
            // на каком смс он закончил читать группу
            // initialScrollIndex
            renderItem={({ item: message, index }) => (
               <TouchableOpacity
                  onPress={() => onMessagePress(message)}
                  onLongPress={() => onMessageLongPress(message)}
               >
                  <Message
                     key={message.id}
                     message={message}
                     email={user.email}
                     theme={user.theme}
                     nextMessageEmail={messages[index + 1]?.email ?? null}
                     isBacklight={message.id === selectedMessageId || message.id === backligthMessage}
                     chatId={chatId}
                     isLastMessage={index === messages.length - 1}
                     setBackligthMessage={() => {
                        setBackligntMessage(message.replyingId);
                        scrollToIndex(message.replyingId);
                     }}
                  />
               </TouchableOpacity>
            )}
         />
      </>
   );
}
