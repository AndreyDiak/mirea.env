import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/themed";

import React, { useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import { ChatHeader, MessageForm, MessagesList } from "../components";

import type { ChatScreenNavigatorProp, DBMessage, RootStackParamList } from "../typings";

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

export const ChatScreen = () => {
  const [isReplyingOnMessage, setIsReplyingOnMessage] = useState<boolean>(false);
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState<boolean>(false);
  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState<boolean>(true);
  const [selectedMessage, setSelectedMessage] = useState<DBMessage>(null);
  const tw = useTailwind();

  const {
    params: { chatId, groupName },
  } = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigatorProp>();

  // set pageHeader
  useLayoutEffect(() => {
    navigation.setOptions({
      headerClose: () => <Text>Close</Text>,
      headerTitle: () =>
        !isHeaderMenuVisible ? (
          <View>
            <Text style={tw("text-xl font-semibold")}>{groupName}</Text>
          </View>
        ) : (
          <ChatHeader
            message={selectedMessage}
            onClose={headerClose}
            replyOnMessage={() => {
              setIsReplyingOnMessage(true);
              setIsHeaderMenuVisible(false);
            }}
          />
        ),
      headerRight: () =>
        isHeaderMenuVisible && (
          <TouchableOpacity onPress={headerClose}>
            <Icon name="close" type="material" size={30} color="#374151" />
          </TouchableOpacity>
        ),
    });
  }, [isHeaderMenuVisible, selectedMessage]);

  // closingTitle function...
  const headerClose = () => {
    setIsHeaderMenuVisible(false);
    setSelectedMessage(null);
  };

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
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
