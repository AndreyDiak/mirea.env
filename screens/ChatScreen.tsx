import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import ChatTitle from "../components/ChatTitle";
import Message from "../components/Message";
import MessageForm from "../components/MessageForm";
import { getUser } from "../features/userSlice";
import { db } from "../firebase";

type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

const ChatScreen = () => {
  const [title, setTitle] = useState("Загрузка...");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isReplyingOnMessage, setIsReplyingOnMessage] = useState(false);

  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(true);

  const [backligthMessage, setBackligntMessage] = useState<string | null>(null);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const flatListRef = useRef();
  const user = useSelector(getUser);
  const tw = useTailwind();

  const {
    params: { discipline, groupId, chatId },
  } = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigatorProp>();

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

  //scrollToBottom function
  const scrollToBottom = () => {
    // @ts-ignore all exists...
    flatListRef.current.scrollToEnd({ animating: true });
    setIsScrollToBottomVisible(false);
    setBackligntMessage(null);
  };

  const scrollToIndex = (activeMessageIndex: string | null) => {
    if (activeMessageIndex) {
      // @ts-ignore all exists...
      flatListRef.current.scrollToIndex({
        animating: true,
        index: messages.findIndex(
          (msg) => msg.messageId === activeMessageIndex
        ),
      });
    }
  };

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

  // onMessagePress function...
  const onMessagePress = (message: Message) => {};
  // onMessageLongPress function...
  const onMessageLongPress = (message: Message) => {
    setIsHeaderMenuVisible(true);
    setSelectedMessage(message);
  };

  return (
    <SafeAreaView style={tw("relative")}>
      {isScrollToBottomVisible && messages.length > 10 && (
        <TouchableOpacity
          onPress={scrollToBottom}
          style={tw(
            "bg-white w-16 h-16 flex items-center justify-center rounded-full absolute right-5 bottom-20 z-10"
          )}
        >
          <Icon
            name="keyboard-arrow-down"
            type="material"
            color={"#60a5fa"}
            size={40}
          />
        </TouchableOpacity>
      )}
      <KeyboardAvoidingView style={tw("flex flex-col h-full")}>
        {messages.length > 0 ? (
          <FlatList
            // @ts-ignore some ref issues..
            ref={flatListRef}
            style={tw("w-full")}
            data={messages}
            scrollEnabled
            onScrollEndDrag={() => {
              if (!isScrollToBottomVisible) {
                setIsScrollToBottomVisible(true);
              }
            }}
            onEndReached={() => setIsScrollToBottomVisible(false)}
            showsVerticalScrollIndicator={false}
            // initialScrollIndex={messages.length - 3}
            renderItem={(item) => (
              <TouchableOpacity
                onPress={() => onMessagePress(item.item)}
                onLongPress={() => onMessageLongPress(item.item)}
              >
                <Message
                  key={item.index}
                  message={item.item}
                  email={user?.email as string}
                  nextMessageEmail={
                    !!messages[item.index + 1]
                      ? messages[item.index + 1].email
                      : null
                  }
                  isBacklight={
                    item.item.messageId === selectedMessage?.messageId ||
                    item.item.messageId === backligthMessage
                  }
                  chatId={chatId}
                  setBacklighMessage={() => {
                    setBackligntMessage(item.item.replyingMessage);
                    scrollToIndex(item.item.replyingMessage);
                  }}
                />
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={tw("flex flex-row items-center justify-center flex-1")}>
            <View>
              <Text style={tw("text-center text-lg w-5/6 mx-auto")}>
                Напишите первое сообщение в этом чате!
              </Text>
              <Icon
                name="chat-bubble-outline"
                type="material"
                color="#60a5fa"
                size={30}
              />
            </View>
          </View>
        )}
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
