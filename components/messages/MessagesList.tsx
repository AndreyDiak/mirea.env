import React, { useCallback, useRef, useState } from "react";

import { FlatList, TouchableOpacity } from "react-native";

import { Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { useMessages } from "../../features/hooks";
import { selectUser } from "../../features/slices/userSlice";
import { useTheme } from "../../hooks";
import type { Message as MessageType } from "../../typings";
import { isEmpty } from "../../utils";
import { CenteredText } from "../common";
import { Message } from "./Message";
import { MessagesScrollToBottom } from "./MessagesScrollToBottom";

interface Props {
   chatId: string;
   isScrollButtonShown: boolean;
   selectedMessageId: string | undefined;
   onLongPressMessage(message: MessageType): void;
   setIsScrollButtonShown: (isVisible: boolean) => void;
}

export function MessagesList({
   chatId,
   isScrollButtonShown,
   selectedMessageId,
   setIsScrollButtonShown,
   onLongPressMessage,
}: Props) {
   const tw = useTailwind();
   const user = useSelector(selectUser);
   const flatListRef = useRef(null);
   const { messages, loading } = useMessages(chatId);
   const { THEME_MAIN } = useTheme();
   const [backligthMessage, setBackligntMessage] = useState<string | null>(null);

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
      setIsScrollButtonShown(false);
   }, [setIsScrollButtonShown]);

   // onMessagePress function...
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const onMessagePress = (message: MessageType) => {
      // fast press on message
   };

   if (loading && isEmpty(messages)) {
      return (
         <CenteredText
            text="Загрузка сообщений"
            Icon={<Icon name="chat-bubble-outline" type="material" color={THEME_MAIN} size={30} />}
         />
      );
   }

   if (isEmpty(messages)) {
      return (
         <CenteredText
            text="Напишите первое сообщение!"
            Icon={<Icon name="chat-bubble-outline" type="material" color={THEME_MAIN} size={30} />}
         />
      );
   }

   return (
      <>
         <MessagesScrollToBottom isVisible={isScrollButtonShown} handleScroll={scrollToBottom} />

         <FlatList
            ref={flatListRef}
            style={tw("w-full flex-1 py-2 mb-16")}
            data={messages}
            scrollEnabled
            // добавляем кнопку если добавились сообщения
            onContentSizeChange={() => {
               setIsScrollButtonShown(true);
            }}
            // когда мы доскролили убираем кнопку
            // onScrollEndDrag={() => {
            //    if (!isScrollToBottomVisible) {
            //       setIsScrollToBottomVisible(true);
            //    }
            // }}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
               if (isScrollButtonShown) {
                  setIsScrollButtonShown(false);
               }
            }}
            // TODO @raymix у каждого пользователя должна хранится инфа
            // на каком смс он закончил читать группу
            // initialScrollIndex
            renderItem={({ item: message, index }) => (
               <TouchableOpacity
                  onPress={() => onMessagePress(message)}
                  onLongPress={() => onLongPressMessage(message)}
               >
                  <Message
                     key={message.id}
                     message={message}
                     email={user.email}
                     theme={user.theme}
                     appTheme={user.appTheme}
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
