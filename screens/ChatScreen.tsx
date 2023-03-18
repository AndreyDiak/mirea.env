import React, { useCallback, useLayoutEffect, useState } from "react";

import { KeyboardAvoidingView, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { ChatHeader, MessageForm, MessagesList, ScreenTemplate } from "../components";
import { selectUserAppTheme } from "../features/userSlice";
import { useTheme } from "../hooks";
import type { ChatScreenNavigatorProp, DBMessage, RootStackParamList } from "../typings";
import { APP_THEME } from "../typings/enums";

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

export function ChatScreen() {
   const tw = useTailwind();
   const appTheme = useSelector(selectUserAppTheme);

   const { APP_THEME_TEXT, APP_THEME_SECONDARY } = useTheme();

   // TODO @raymix переделать на хук?
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

   const headerClose = useCallback(() => {
      setIsHeaderMenuVisible(false);
      setSelectedMessage(null);
   }, []);

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
            <Text
               style={[
                  tw("text-xl font-semibold"),
                  {
                     color: APP_THEME_TEXT,
                  },
               ]}
            >
               {groupName}
            </Text>
         </View>
      );
   }, [APP_THEME_TEXT, chatId, groupName, headerClose, isHeaderMenuVisible, selectedMessage, tw]);

   const renderClose = useCallback(() => {
      if (isHeaderMenuVisible) {
         return (
            <TouchableOpacity onPress={headerClose}>
               <Icon
                  name="close"
                  type="material"
                  size={30}
                  color={appTheme === APP_THEME.LIGHT ? "#374151" : APP_THEME_TEXT}
               />
            </TouchableOpacity>
         );
      }
      return null;
   }, [APP_THEME_TEXT, appTheme, headerClose, isHeaderMenuVisible]);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: renderTitle,
         headerRight: renderClose,
         headerStyle: {
            backgroundColor: APP_THEME_SECONDARY,
         },
      });
   }, [
      APP_THEME_SECONDARY,
      appTheme,
      groupName,
      isHeaderMenuVisible,
      navigation,
      renderClose,
      renderTitle,
      selectedMessage,
      tw,
   ]);

   return (
      <ScreenTemplate>
         <SafeAreaView style={tw("relative h-full")}>
            <KeyboardAvoidingView style={tw("flex flex-col h-full")}>
               {/* Messages */}
               <MessagesList
                  chatId={chatId}
                  isScrollToBottomVisible={isScrollToBottomVisible}
                  selectedMessageId={selectedMessage?.id}
                  setIsScrollToBottomVisible={setIsScrollToBottomVisible}
                  setSelectedMessage={setSelectedMessage}
                  setIsHeaderMenuVisible={setIsHeaderMenuVisible}
               />
               {/* Message Form */}
               <MessageForm
                  setIsReplyingOnMessage={setIsReplyingOnMessage}
                  setIsScrollToBottomVisible={setIsScrollToBottomVisible}
                  setActiveMessage={setSelectedMessage}
                  setIsMessageEdited={setIsMessageEdited}
                  isReplyingOnMessage={isReplyingOnMessage}
                  activeMessage={selectedMessage}
                  chatId={chatId}
                  editedMessageData={editedMessageData}
                  isMessageEdited={isMessageEdited}
               />
            </KeyboardAvoidingView>
         </SafeAreaView>
      </ScreenTemplate>
   );
}
