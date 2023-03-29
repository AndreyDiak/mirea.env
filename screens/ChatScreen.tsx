import React, { useCallback, useLayoutEffect } from "react";

import { KeyboardAvoidingView, SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";

import { ChatHeader, MessageForm, MessagesList, ScreenTemplate } from "../components";
import { selectUserAppTheme } from "../features/slices/userSlice";
import { useChatData, useTheme } from "../hooks";
import type { ChatScreenRouteProp, ChatsScreenNavigationProp } from "../typings";
import { APP_THEME } from "../typings/enums";

export function ChatScreen() {
   const tw = useTailwind();
   const appTheme = useSelector(selectUserAppTheme);

   const { APP_THEME_TEXT, APP_THEME_SECONDARY } = useTheme();

   const {
      isReplying,
      isEdited,
      isScrollButtonShown,
      isHeaderMenuShown,
      activeMessage,
      editedMessage,

      onEditMessage,
      onHeaderClose,
      onReplyMessage,
      onLongPressMessage,
      onReplyEndMessage,

      setIsScrollButtonShown,
      setIsReplying,
      setIsEdited,
   } = useChatData();

   const {
      params: { chatId, groupName },
   } = useRoute<ChatScreenRouteProp>();

   const navigation = useNavigation<ChatsScreenNavigationProp>();

   const renderTitle = useCallback(() => {
      if (isHeaderMenuShown) {
         return (
            <ChatHeader
               chatId={chatId}
               selectedMessage={activeMessage}
               onClose={onHeaderClose}
               replyOnMessage={onReplyMessage}
               editMessage={onEditMessage}
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
   }, [
      APP_THEME_TEXT,
      activeMessage,
      chatId,
      groupName,
      isHeaderMenuShown,
      onEditMessage,
      onHeaderClose,
      onReplyMessage,
      tw,
   ]);

   const renderClose = useCallback(() => {
      if (isHeaderMenuShown) {
         return (
            <TouchableOpacity onPress={onHeaderClose}>
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
   }, [APP_THEME_TEXT, appTheme, isHeaderMenuShown, onHeaderClose]);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: renderTitle,
         headerRight: renderClose,
         headerStyle: {
            backgroundColor: APP_THEME_SECONDARY,
         },
      });
   }, [APP_THEME_SECONDARY, navigation, renderClose, renderTitle]);

   return (
      <ScreenTemplate>
         <SafeAreaView style={tw("relative h-full")}>
            <KeyboardAvoidingView style={tw("flex flex-col h-full")}>
               {/* Messages */}
               <MessagesList
                  chatId={chatId}
                  isScrollButtonShown={isScrollButtonShown}
                  selectedMessageId={activeMessage?.id}
                  setIsScrollButtonShown={setIsScrollButtonShown}
                  onLongPressMessage={onLongPressMessage}
               />
               {/* Message Form */}
               <MessageForm
                  onReplyEndMessage={onReplyEndMessage}
                  setIsReplying={setIsReplying}
                  setIsEdited={setIsEdited}
                  isReplying={isReplying}
                  activeMessage={activeMessage}
                  chatId={chatId}
                  editedMessage={editedMessage}
                  isEdited={isEdited}
               />
            </KeyboardAvoidingView>
         </SafeAreaView>
      </ScreenTemplate>
   );
}
