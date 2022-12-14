import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";

import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text, View
} from "react-native";
import { useTailwind } from "tailwind-rn/dist";
import ChatTitle from "../components/messages/ChatTitle";
import MessageForm from "../components/messages/MessageForm";
import Messages from "../components/messages/Messages";
import { db } from "../firebase";

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

const ChatScreen = () => {
  const [title, setTitle] = useState("Загрузка...");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isReplyingOnMessage, setIsReplyingOnMessage] = useState(false);

  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(true);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const tw = useTailwind();

  const {
    params: { discipline, groupId, chatId },
  } = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigatorProp>();

  // set pageHeader
  useLayoutEffect(() => {
    navigation.setOptions({
      headerClose: () => <Text>Close</Text>,
      headerTitle: () =>
        !isHeaderMenuVisible ? (
          <View>
            <Text style={tw("text-xl font-semibold")}>{title}</Text>
          </View>
        ) : (
          <ChatTitle
            message={selectedMessage as Message}
            onClose={onTitleClose}
            replyOnMessage={() => {
              setIsReplyingOnMessage(true);
              setIsHeaderMenuVisible(false);
            }}
          />
        ),
    });
  }, [title, isHeaderMenuVisible, selectedMessage]);

  // set groupTitle
  useEffect(() => {
    const getGroupTitle = async () => {
      const q = doc(db, "groups", groupId);
      const snapshot = await getDoc(q);
      const title = snapshot.data();
      // @ts-ignore получаем название группы...
      setTitle(title.name);
    };
    getGroupTitle();
  }, []);

  // subscribe to recieve messages...
  const q = query(
    collection(db, `chats/${chatId}/messages`),
    orderBy("timestamp")
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const snapMessages = snapshot.docs.map((message) => ({
      ...message.data(),
      messageId: message.id,
    }));
    if (messages.length !== snapMessages.length) {
      setMessages(snapMessages as Message[]);
      setIsScrollToBottomVisible(true);
    }
  });

  // closingTitle function...
  const onTitleClose = () => {
    setIsHeaderMenuVisible(false);
    setSelectedMessage(null);
  };

  return (
    <SafeAreaView style={tw("relative")}>
      <KeyboardAvoidingView style={tw("flex flex-col h-full")}>
        {/* Messages */}
        <Messages
          chatId={chatId}
          messages={messages}
          isScrollToBottomVisible={isScrollToBottomVisible}
          setIsScrollToBottomVisible={setIsScrollToBottomVisible}
          selectedMessageId={selectedMessage?.messageId}
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

export default ChatScreen;
