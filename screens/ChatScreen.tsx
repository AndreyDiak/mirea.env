import React, { useCallback, useLayoutEffect, useState } from "react";

import { KeyboardAvoidingView, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { useTailwind } from "tailwind-rn/dist";

import { ChatHeader, MessageForm, MessagesList } from "../components";
import type { ChatScreenNavigatorProp, DBMessage, RootStackParamList } from "../typings";

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

export function ChatScreen() {
   const tw = useTailwind();
   const [isReplyingOnMessage, setIsReplyingOnMessage] = useState<boolean>(false);
   const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState<boolean>(false);
   const [isMessageEdited, setIsMessageEdited] = useState<boolean>(false);
   const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState<boolean>(true);
   const [selectedMessage, setSelectedMessage] = useState<DBMessage>(null);
   const [editedMessageData, setEditedMessageData] = useState({
      text: "",
      id: "",
   });
   const {
      params: { chatId, groupName },
   } = useRoute<ChatScreenRouteProp>();
   const navigation = useNavigation<ChatScreenNavigatorProp>();

   const headerClose = () => {
      setIsHeaderMenuVisible(false);
      setSelectedMessage(null);
   };

   const renderTitle = useCallback(() => {
      if (isHeaderMenuVisible) {
         return (
            <ChatHeader
               chatId={chatId}
               selectedMessage={selectedMessage}
               onClose={headerClose}
               replyOnMessage={() => {
                  setIsReplyingOnMessage(true);
                  setIsHeaderMenuVisible(false);
               }}
               editMessage={() => {
                  setIsMessageEdited(true);
                  setEditedMessageData({
                     id: selectedMessage.id,
                     text: selectedMessage.text,
                  });
                  headerClose();
               }}
            />
         );
      }
      return (
         <View>
            <Text style={tw("text-xl font-semibold")}>{groupName}</Text>
         </View>
      );
   }, [chatId, groupName, isHeaderMenuVisible, selectedMessage, tw]);

   const renderClose = useCallback(() => {
      if (isHeaderMenuVisible) {
         return (
            <TouchableOpacity onPress={headerClose}>
               <Icon name="close" type="material" size={30} color="#374151" />
            </TouchableOpacity>
         );
      }
      return null;
   }, [isHeaderMenuVisible]);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: () => renderTitle(),
         headerRight: () => renderClose(),
      });
   }, [groupName, isHeaderMenuVisible, navigation, renderClose, renderTitle, selectedMessage, tw]);

   return (
      <SafeAreaView style={tw("relative")}>
         <KeyboardAvoidingView style={tw("flex flex-col h-full")}>
            {/* Messages */}
            <MessagesList
               chatId={chatId}
               isScrollToBottomVisible={isScrollToBottomVisible}
               setIsScrollToBottomVisible={setIsScrollToBottomVisible}
               selectedMessageId={selectedMessage?.id}
               setSelectedMessage={setSelectedMessage}
               setIsHeaderMenuVisible={setIsHeaderMenuVisible}
            />
            {/* Message Form */}
            <MessageForm
               setIsReplyingOnMessage={setIsReplyingOnMessage}
               setIsScrollToBottomVisible={setIsScrollToBottomVisible}
               setActiveMessage={setSelectedMessage}
               isReplyingOnMessage={isReplyingOnMessage}
               activeMessage={selectedMessage}
               chatId={chatId}
               setIsMessageEdited={setIsMessageEdited}
               editedMessageData={editedMessageData}
               isMessageEdited={isMessageEdited}
            />
         </KeyboardAvoidingView>
      </SafeAreaView>
   );
}
