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

type Props = {};
type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;

const ChatScreen = (props: Props) => {
  const [title, setTitle] = useState("Загрузка...");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isScrollToBottomVisible, setIsScrollToBottomVisible] = useState(true);
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
      headerTitle: title,
      headerColor: "#60a5fa",
    });
  }, [title]);

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

  return (
    <SafeAreaView style={tw("relative bg-gray-100")}>
      {isScrollToBottomVisible && (
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
      <KeyboardAvoidingView style={tw("flex flex-col h-full p-2")}>
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
              <Message message={item.item} email={user?.email as string} />
            )}
          />
        ) : (
          <View>
            <Text>no messages...</Text>
          </View>
        )}

        <View style={tw("flex flex-row items-center")}>
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
