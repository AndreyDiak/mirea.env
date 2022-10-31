import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "@rneui/themed";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";



import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import Message from "../components/Message";
import { getUser } from "../features/userSlice";
import { db } from "../firebase";
import ChatTitle from "../components/ChatTitle";

type Props = {};
type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

const ChatScreen = (props: Props) => {
  const [title, setTitle] = useState("Загрузка...");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isHeaderMenuVisible, setIsHeaderMenuVisible] = useState(false);
  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(true);
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
      headerTitle: () =>
        !isHeaderMenuVisible ? (
          <View>
            <Text>{title}</Text>
          </View>
        ) : (
          <ChatTitle message={selectedMessage as Message} onClose={onTitleClose}/>
        ),
    });
  }, [title, isHeaderMenuVisible, selectedMessage]);

  // sendMessage function
  const sendMessage = async () => {
    await addDoc(collection(db, `chats/${chatId}/messages`), {
      message: message,
      timestamp: serverTimestamp(),
      displayName: user?.name,
      email: user?.email,
      type: user?.type,
      photoUrl: user?.img,
    }).then(async (res) => {
      Keyboard.dismiss();
      setMessage("");
    });
  };

  //scrollToBottom function
  const scrollToBottom = () => {
    // @ts-ignore all exists...
    flatListRef.current.scrollToEnd({ animating: true });
    setIsScrollToBottomVisible(false);
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

  const onTitleClose = () => {
    setIsHeaderMenuVisible(false);
    setSelectedMessage(null);
  }

  const onMessagePress = (message: Message) => {};

  const onMessageLongPress = (message: Message) => {
    setIsHeaderMenuVisible(true);
    setSelectedMessage(message);
    console.log("long");
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
                    item.item.messageId === selectedMessage?.messageId
                  }
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

        <View style={tw("flex flex-row items-center px-2")}>
          {/* Reply message or Reply Post from discipline... */}
          <TextInput
            onFocus={() => setIsScrollToBottomVisible(false)}
            style={tw("bg-white flex-1 mr-4 rounded-md p-2 h-12")}
            placeholder="Введите текст..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity onPress={sendMessage}>
            <Icon name="send" type="material" color="#60a5fa" size={25} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
