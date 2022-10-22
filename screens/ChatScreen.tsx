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
  Timestamp
} from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Keyboard, KeyboardAvoidingView, SafeAreaView, ScrollView, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import { useSelector } from "react-redux";
import { useTailwind } from "tailwind-rn/dist";
import UserAvatar from "../components/UserAvatar";
import { getUser } from "../features/userSlice";
import { db } from "../firebase";
import moment from 'moment'
type Props = {};
type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;
const ChatScreen = (props: Props) => {
  const [title, setTitle] = useState("Загрузка...");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const user = useSelector(getUser);
  const tw = useTailwind();

  const {
    params: { discipline, groupId, chatId },
  } = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigatorProp>();

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerColor: "#60a5fa",
    });
  }, [title]);

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
  console.log(user?.type + " ->");
  console.log(chatId);
  console.log(discipline);
  const q = query(
    collection(db, `chats/${chatId}/messages`),
    orderBy("timestamp")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const snapMessages = snapshot.docs.map((message) => ({
      ...message.data(),
      messageId: message.id,
    }));
    if (messages.length !== snapMessages.length)
      setMessages(snapMessages as Message[]);
  });

  return (
    <SafeAreaView style={tw("")}>
      <KeyboardAvoidingView style={tw("flex flex-col h-full p-4")}>
        <ScrollView style={tw("mb-4")}>
          {messages.length > 0 ? (
            messages.map((msg) => {
              console.log(msg.timestamp.toDate());
              return (
                <View
                  style={tw(
                    `w-full flex flex-row p-4 ${
                      msg.email === user?.email ? "justify-end" : "justify-start"
                    }`
                  )}
                >
                  <View
                    key={msg.messageId}
                    style={tw(
                      `${
                        msg.email === user?.email ? "bg-white" : "bg-blue-400"
                      } rounded-md mb-2 px-6 py-4 relative`
                    )}
                  >
                    <Text
                      style={tw(
                        `${
                          msg.email === user?.email
                            ? "right-2 text-gray-400"
                            : "left-2 text-gray-200"
                        } absolute text-xs `
                      )}
                    >
                      {msg.email === user?.email
                        ? "Вы"
                        : msg.type === "student"
                        ? "студент"
                        : "преподаватель"}
                    </Text>
                    <Text
                      style={tw(
                        `${
                          msg.email === user?.email
                            ? "text-gray-600"
                            : "text-white"
                        } font-semibold text-sm text-center mb-2`
                      )}
                    >
                      {msg.message}
                    </Text>
                    <View> 
                      <Text style={tw(`text-xs ${msg.email === user?.email ? '' : 'text-right text-gray-800'}`)}>{moment(msg.timestamp.toDate()).format('LT')}</Text>
                    </View>
                    <View style={tw(`absolute -bottom-5 ${msg.email === user?.email ? '-right-7' : '-left-3'}`)}>
                      <UserAvatar source={msg.photoUrl} size={'small'}/>
                    </View>
                  </View>
                </View>
              )
            })
          ) : (
            <View>
              <Text>no messages...</Text>
            </View>
          )}
        </ScrollView>
        <View style={tw("flex flex-row items-center")}>
          <TextInput
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
